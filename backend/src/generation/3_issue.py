import json, os, sys, time
import pandas as pd
sys.path.insert(1, os.path.join(sys.path[0], '..'))# adds parent dir to PYTHONPATH to enable importing from there
from backend_utils import (BACKEND_ROOT, get_here, get_modelpath, get_datapath, load_model, create_csv, insert_row)
print(BACKEND_ROOT)
DATAPATH = get_datapath()
MODELPATH = get_modelpath(folder = False)
"""
Implements the following:
- issue/pain-point inference (generate_issues)
- tagging of reviews with inferred issues (generate_issue_tagging)
WARNING: issue inference is by far the most computationally heavy step. 
for context, using review summaries of all Neutral+Negative reviews resulted in input of nearly 30k tokens and took over 15h to process on 10gb of VRAM
Additional helper function: build_gen_message for making large singular queries
"""
def generate_issues(model, message, datapath, service): 
    """
    returns list of up to 5 issues, inferred from the given message, or None
    args: 
    - model: Llama object
    - message: string, input query. 
    - datapath: appends output to data/issues.csv
    - service: service area for logging purposes
    notes: 
    due to heavy computation load and risk of crashes, 
    each call of this function attempts to log output to isues.csv 
    especially because this is called twice - once for banking-related issues, and for app-related issues
    """
    # given review, label service aspect: banking or app
    issue_prompt = f"""
    You are a helpful assistant to a customer experience team that outputs in JSON. 
    You will be provided with a list of app store reviews for digital banking apps. Each customer review is unhappy with some app-related issue. 
    Your job is to come up with a list of common issues affecting these customers. NO MORE THAN 5 issues. 
    Answer in the following format strictly: 
    "[issue1, issue2, issue3,...]"
    """
    history = [{"role": "system", "content": issue_prompt},{"role":"user","content":message}]
    inittime = time.time()
    try:
        completion = model.create_chat_completion(
            messages=history,
            temperature=0.7,
            response_format={
                "type": "json_object",
                "schema": {
                    "type": "object",
                    "properties": {
                        "issue": {"type": "issue"},
                    },
                    "required": ["issues"],
                },
            }
        )
        # 1. extract answer as json string, 2. load dict, 3. extract desired field
        answer = json.loads(completion['choices'][0]['message']['content'])["issues"]
    except:
        answer = None
    endtime = time.time()
    
    # save output
    issues_file = os.path.join(datapath, 'issues.csv')
    if not os.path.exists(issues_file):
        with open(issues_file, 'w') as file:
            file.write("service,answer,inittime,endtime\n")
    with open(issues_file, 'a') as file:
            file.write(f"{service},\"{answer}\",{inittime},{endtime}\n")
    return answer
def generate_issue_tagging(model, datapath, issue_list, service, df):
    """
    for issue in issue_list, creates tagging for each review in final_data.csv, within the given service
    returns 1 if success
    args: 
    - model: Llama object, 
    - datapath: will read final_data.csv from here, and write output issue.csv to here
    - issue_list: list of issues that each review will be tagged with
    - service: whether to write to banking.csv or app.csv
    - df: pandas df of reviews. expected to be already partitioned according to service
    Notes: 
    - this function writes to output file every time a row is processed to save progress in case of crashes or other interrupts
    - the requisite system prompt is located within this function
    - despite extensive attempts at guiding the model output with examples, the issue tagging is not done super well. 
    - known to mutate the issue string when tagging, hence necessitating manual cleanup of issue column later using something resembling eda.py
    """
    issues = ""
    i=1
    for issue in issue_list:
        issues+=f"{i}. {issue}\n"
        i+=1
    issuetag_prompt = f"""
    You are a helpful assistant to a customer experience team that outputs in JSON. 
    Look at each customer review and classify it based on the following issues: {issue_list}
    if NONE of the above issues are a good fit, you may say "other". OTHERWISE, restate the issue EXACTLY. We DO NOT WANT summaries, but single-label classification only. 
    
    Example: 
        Issues: ["UI/UX", "account creation", "login problems", "technical glitches"]
        
        Review: "This app crashes every time I try to open it. I've reinstalled it multiple times, but the problem persists. It's frustrating not being able to access my account when I need to."
        Correct answer: "technical glitches", Incorrect answer: "technical_glitches"
        
        Review: "Navigating this app feels like a maze. The layout is confusing, and it's not always clear where to find certain features. It desperately needs a UI overhaul to make it more user-friendly."
        Correct answer: "UI/UX", Incorrect answer: "UI/UX, user did not like layout"
        
        Review: "The transactions in the app don't match up with what's actually happening in my bank account. It's like the app is stuck in the past, showing transactions from days ago while ignoring recent activity."
        Correct answer: "other", Incorrect answer: "others, account sync"
        
    Another example: 
        Issues: ["Account Access Issues", "Transaction Errors", "Unauthorized Transactions", "Long Wait Times"]
        
        Review: "I attempted to transfer money to a friend, but the transaction failed, and now the money is stuck in limbo. I don't understand why these errors keep happening, and it's causing a lot of inconvenience."
        Correct answer: "Account Access Issues", Incorrect answer: "The user encountered Account Access Issues"
        
        Review: "I called customer support over an hour ago, and I'm still on hold. This is ridiculous—I shouldn't have to wait this long just to speak to a representative. The bank needs to improve its support system."
        Correct answer: "Long Wait Times", Incorrect answer: "long-wait-times"
        
        Review: "I received an email from the bank about changes to my account, but the information was so vague and confusing that I still don't understand what's happening. The bank needs to communicate more clearly with its customers."
        Correct answer: "other", Incorrect answer: "poor bank communication"
    """
    print(issuetag_prompt)
    outputpath = os.path.join(datapath,f".\\{service}.csv")
    print(f"writing to {outputpath}")
    with open(outputpath, 'w') as file:
        file.write("rowid,issue,summary\n")
    history = [{"role": "system", "content": issuetag_prompt}]
    answers = []
    for index, row in df.iterrows():
        print(row.to_string())
        history.append({"role":"user","content":row['review']})
        
        completion = model.create_chat_completion(
            messages=history,
            temperature=0.4,
            response_format={
                "type": "json_object",
                "schema": {
                    "type": "object",
                    "properties": {
                        "issue": {"type": "string"},
                    },
                    "required": ["issue"],
                },
            }
        )
        answer = json.loads(completion['choices'][0]['message']['content'])["issue"]
        with open(outputpath, 'a') as file:
            file.write(f"{row['rowid']},\"{answer}\",\"{row['summary']}\"\n")
        history.pop()
        answers.append({
            'rowid': row['rowid'],
            'issue': answer
        })
    return answers
def build_gen_message(df, subset = 0):
    """
    helper function to load model and build query for generate_issues
    returns: 
    - string of concatenated summaries, 
    - Llama object, with context window resized
    args:
    - df: pandas df, expects a 'summary' column, produced by 2_service.generate_service
    - subset: generate from first n review summaries if set, else uses whole df
    """
    if subset: df = df.iloc[:subset]
    issue_gen_message = df[['summary']].to_string(index=False, justify='left') # input to pass into model
    print("message:\n", issue_gen_message)
    ctx_window = (int(len(issue_gen_message) / 10.0)+50) * 10 # add some overhead for system prompt

    model = load_model(
        MODELPATH, 
        ctx_window, 
        use_mlock=True,
        n_threads_batch=64,
        n_batch=256)
    return model, issue_gen_message
def get_nonpositive_reviews(DATAPATH):
    """
    helper function for data manipulation. gets reviews for GXS and Trust Bank, merges with sentiment taggings and 
    returns all that are Neutral or Negative
    """
    ## loading, shaping reviews:
    final_data = pd.read_csv(DATAPATH+'/final_data.csv')
    reviews = final_data[['rowid', 'bank', 'review']]
    reviews = reviews.query('bank == "GXS" | bank == "Trust"')
    # print("reviews:\n",reviews.head())
    ## load sentiment taggings
    sentiment = pd.read_csv(DATAPATH+'/sent_derive.csv')
    sentiment = sentiment[["rowid", "sentiment"]]
    service = pd.read_csv(DATAPATH+'/service.csv')[['rowid','service','summary']]
    print("service:\n",service.head())
    ## merge, filter
    merged = pd.merge(sentiment, reviews, on='rowid') # left join
    merged = pd.merge(merged, service, on='rowid')
    print(merged.head())
    nonpositive = merged.loc[merged['sentiment'] != "Positive"]
    print("nonpositive:\n",nonpositive.head())
    return nonpositive
    
def main():
    nonpositive = get_nonpositive_reviews(DATAPATH)
    
    banking = nonpositive[nonpositive['service'].str.contains("bank",na=False)]
    app = nonpositive[nonpositive['service']=='app']
    misc = nonpositive[(~nonpositive['service'].str.contains("bank",na=False))&(nonpositive['service']!='app')]
    
    print("banking:\n",banking.head())
    print("app:\n",app.head())
    print("misc:\n",misc) # mis-tagged reviews, not a large portion
    print(misc['service'].unique()) 
    
    llm, issue_gen_message = build_gen_message(banking)
    bank_issues = None
    while bank_issues is None:
        bank_issues = generate_issues(llm, issue_gen_message, DATAPATH)
        print(bank_issues)

    llm, issue_gen_message = build_gen_message(app) # final token count was right on the edge of what my RAM/VRAM could allow, about 30 000
    app_issues = None
    while app_issues is None:
        app_issues = generate_issues(llm, issue_gen_message, DATAPATH)
        print(app_issues)

    llm = load_model(MODELPATH, 1500)
    if bank_issues:
        bank_issue_tagging = generate_issue_tagging(llm,DATAPATH, bank_issues, 'banking',banking)
        print(bank_issue_tagging)
    if app_issues:
        app_issue_tagging = generate_issue_tagging(llm,DATAPATH, app_issues, 'app',app)
        print(app_issue_tagging)
    ## the initial run below, was done in separate steps
    # print(generate_issue_tagging(llm, DATAPATH, ['Account issues (e.g., account locking, difficulty opening accounts, application rejection)', 'Technical issues (e.g., login problems, app malfunction, incorrect information)', 'Interest rate concerns (e.g., decrease, dissatisfaction)', 'Transaction issues (e.g., delayed, failed, fraudulent)', 'Long waiting times (e.g., approval, resolution, onboarding)'], "banking",banking))
    # print(generate_issue_tagging(llm, DATAPATH, ['Difficulty applying credit card, savings account', 'Login issues', 'Technical difficulties during registration and setup', 'User interface and design issues', 'Lack of expected features or functionality'], "app",app))

if __name__=="__main__": 
    main() 
    