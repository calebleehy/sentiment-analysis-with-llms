import json, os, sys
import pandas as pd
sys.path.insert(1, os.path.join(sys.path[0], '..'))# adds parent dir to PYTHONPATH to enable importing from there
from backend_utils import (BACKEND_ROOT, get_here, get_modelpath, get_datapath, load_model, create_csv, insert_row)
print(BACKEND_ROOT)
DATAPATH = get_datapath()
MODELPATH = get_modelpath(folder = False)

def generate_issue_tagging(model, datapath, issue_list, service, df):
    """
    given issue_list, returns issue tagging for each review in final_data.csv (assumes it has been created)
    args: 
    - model: Llama object, 
    - datapath: will read final_data.csv from here, and write output issue.csv to here
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
    return 1

def main():
    
    ## loading, shaping data:
    final_data = pd.read_csv(DATAPATH+'/final_data.csv')
    reviews = final_data[['rowid', 'bank', 'review']]
    reviews = reviews.query('bank == "GXS" | bank == "Trust"')
    # print("reviews:\n",reviews.head())
    
    sentiment = pd.read_csv(absdatapath+'/sentiment.csv')
    sentiment = sentiment[["rowid", "sentiment"]]
    service = pd.read_csv(absdatapath+'/problem_category.csv')[['rowid','problem_category','summary']]
    print("service:\n",service.head())
    
    merged = pd.merge(sentiment, reviews, on='rowid') # left join
    merged = pd.merge(merged, service, on='rowid')
    print(merged.head())
    nonpositive = merged.loc[merged['sentiment'] != " Positive"]
    print("nonpositive:\n",nonpositive.head())
    
    
    banking = nonpositive[nonpositive['problem_category'].str.contains("bank",na=False)]
    app = nonpositive[nonpositive['problem_category']=='app']
    misc = nonpositive[(~nonpositive['problem_category'].str.contains("bank",na=False))&(nonpositive['problem_category']!='app')]
    # banking = pd.merge(banking, merged, on='rowid',how='left')
    # app = pd.merge(app, merged, on='rowid',how='left')
    print("banking:\n",banking.head())
    print("app:\n",app.head())
    print("misc:\n",misc)
    print(misc['problem_category'].unique())
    
    def build_gen_message(df, subset = 0):
        """returns string of concatenated summaries, sets context window and loads model. 
        set subset = n to only generate from first n review summaries"""
        if subset: df = df.iloc[:n]
        issue_gen_message = df[['summary']].to_string(index=False, justify='left') # input to pass into model
        print("message:\n", issue_gen_message)
        ctx_window = (int(len(issue_gen_message) / 10.0)+50) * 10 # add some overhead for system prompt
    
        model = Llama(
            model_path=os.path.normpath(os.path.join(abscurrentpath, '..\\model\\mistral-7b-instruct-v0.2.Q5_K_M.gguf')),
            n_gpu_layers=-1, # Uncomment to use GPU acceleration
            # seed=1337, # Uncomment to set a specific seed
            n_ctx=ctx_window, # Uncomment to increase the context window
            chat_format="chatml",
            use_mlock=True,
            n_threads_batch=64,
            n_batch=256,
        )
        return model, issue_gen_message
    # llm, issue_gen_message = build_gen_message(banking)
    # bank_issues = generate_issues(llm, issue_gen_message, absdatapath)
    # print(bank_issues)
    # llm, issue_gen_message = build_gen_message(app) # final token count was right on the edge of what my RAM/VRAM could allow, about 30 000
    # app_issues = generate_issues(llm, issue_gen_message, absdatapath)
    # print(app_issues)
    llm = Llama(
        model_path=os.path.normpath(os.path.join(abscurrentpath, '..\\model\\mistral-7b-instruct-v0.2.Q5_K_M.gguf')),
        n_gpu_layers=-1, # Uncomment to use GPU acceleration
        # seed=1337, # Uncomment to set a specific seed
        n_ctx=1500, # Uncomment to increase the context window
        chat_format="chatml",
        # use_mlock=True,
        # n_threads_batch=64,
        # n_batch=256,
    )
    print(generate_issue_tagging(llm, absdatapath, ['Account issues (e.g., account locking, difficulty opening accounts, application rejection)', 'Technical issues (e.g., login problems, app malfunction, incorrect information)', 'Interest rate concerns (e.g., decrease, dissatisfaction)', 'Transaction issues (e.g., delayed, failed, fraudulent)', 'Long waiting times (e.g., approval, resolution, onboarding)'], "banking",banking))
    print(generate_issue_tagging(llm, absdatapath, ['Difficulty applying credit card, savings account', 'Login issues', 'Technical difficulties during registration and setup', 'User interface and design issues', 'Lack of expected features or functionality'], "app",app))

if __name__=="__main__": 
    main() 
    