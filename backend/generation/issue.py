from llama_cpp import Llama
import csv, json, os
import pandas as pd
from typing import Sequence

from tqdm import tqdm

# from modules import shared
# from modules.cache_utils import process_llamacpp_cache

try:
    import llama_cpp
except:
    llama_cpp = None

try:
    import llama_cpp_cuda
except:
    llama_cpp_cuda = None

try:
    import llama_cpp_cuda_tensorcores
except:
    llama_cpp_cuda_tensorcores = None


def eval_with_progress(self, tokens: Sequence[int]):
    """
    A copy of

    https://github.com/abetlen/llama-cpp-python/blob/main/llama_cpp/llama.py

    with tqdm to show prompt processing progress.
    """
    assert self._ctx.ctx is not None
    assert self._batch.batch is not None
    self._ctx.kv_cache_seq_rm(-1, self.n_tokens, -1)

    if len(tokens) > 1:
        progress_bar = tqdm(range(0, len(tokens), self.n_batch), desc="Prompt evaluation", leave=False)
    else:
        progress_bar = range(0, len(tokens), self.n_batch)

    for i in progress_bar:
        batch = tokens[i: min(len(tokens), i + self.n_batch)]
        n_past = self.n_tokens
        n_tokens = len(batch)
        self._batch.set_batch(
            batch=batch, n_past=n_past, logits_all=self.context_params.logits_all
        )
        self._ctx.decode(self._batch)
        # Save tokens
        self.input_ids[n_past: n_past + n_tokens] = batch
        # Save logits
        rows = n_tokens
        cols = self._n_vocab
        offset = (
            0 if self.context_params.logits_all else n_tokens - 1
        )  # NOTE: Only save the last token logits if logits_all is False
        self.scores[n_past + offset: n_past + n_tokens, :].reshape(-1)[
            :
        ] = self._ctx.get_logits()[offset * cols: rows * cols]
        # Update n_tokens
        self.n_tokens += n_tokens


def monkey_patch_generate(lib):

    def my_generate(self, *args, **kwargs):

        # if shared.args.streaming_llm:
            # new_sequence = args[0]
            # past_sequence = self._input_ids

            # # Do the cache trimming for StreamingLLM
            # process_llamacpp_cache(self, new_sequence, past_sequence)

        for output in self.original_generate(*args, **kwargs):
            yield output

    lib.Llama.original_generate = lib.Llama.generate
    lib.Llama.generate = my_generate


for lib in [llama_cpp, llama_cpp_cuda, llama_cpp_cuda_tensorcores]:
    if lib is not None:
        lib.Llama.eval = eval_with_progress
        monkey_patch_generate(lib)
def create_csv(filename, headers):
    with open(filename, 'w', newline='', encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
def insert_row(filename, new_row):
    with open(filename, 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(new_row)
        
def generate_issues(model, message, datapath): 
    # given review, label service aspect: banking or app
    issue_prompt = f"""
    You are a helpful assistant to a customer experience team that outputs in JSON. 
    You will be provided with a list of app store reviews for digital banking apps. Each customer review is unhappy with some app-related issue. 
    Your job is to come up with a list of common issues affecting these customers. NO MORE THAN 5 issues. 
    Answer in the following format strictly: 
    "[issue1, issue2, issue3,...]"
    """
    history = [{"role": "system", "content": issue_prompt},{"role":"user","content":message}]
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
    print(type(answer))
    # save output
    with open(os.path.join(datapath,".\\issues.txt"), 'a') as file:
            file.write(f"{answer}\n")
    return answer

def generate_issue_tagging(model, datapath, issue_list, service, df):
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
    here = os.path.dirname(os.path.abspath(__file__)) # lives in backend\generation
    absdatapath=os.path.normpath(os.path.join(here, '..\\data'))
    
    ## loading, shaping data:
    final_data = pd.read_csv(absdatapath+'/final_data.csv')
    final_data["rowid"] = final_data.index # add in review indexing for merging later
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
    