from llama_cpp import Llama
import csv, json, warnings
import pandas as pd
#from tqdm import tqdm

# from modules import shared
# from modules.cache_utils import process_llamacpp_cache

'''
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
'''

def create_csv(filename, headers):
    with open(filename, 'w', newline='', encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
def insert_row(filename, new_row):
    with open(filename, 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(new_row)



def recom_derive(model): 
    # given sentiment, service, intent, produce recommendation in 5 words or less
    
    app_data = pd.read_csv('C:/Users/shish/gxs-sentiment-analysis/backend/data/eda_for_reco.csv')
    app_data["rowid"] = app_data.index
    
    issue_counts = app_data['issue'].value_counts().reset_index()
    issue_counts.columns = ['issue', 'count']
    sorted_issues = issue_counts['issue'].tolist()
    app_data['issue'] = pd.Categorical(app_data['issue'], categories=sorted_issues, ordered=True)
    sorted_df = app_data.sort_values(by='issue')
    print(sorted_df)
    unique_issues = sorted_df['issue'].unique().tolist()
    issues_dict = {}
    for issue in unique_issues:
        issue_context = sorted_df['review'].unique().tolist() # list of reviews with this issue
        issues_dict[issue] = issue_context

    recom_prompt = f"""
    You are a helpful assistant to a customer experience team that outputs in JSON. 
    Currently, some customers are facing the following issue: {issue}
    Please recommend a solution to this in LESS THAN 10 words. 
    Additionally, here are some real customer complaints as context for your decision making: 
    {issue_context}
    """
    answers = []    

    # string/csv wrangling
    subset = sorted_df.loc[:5]
    # ssi = ssi[0:10]
    with open("recom_derive.csv", 'w') as file:
        file.write("rowid,service,issue,recommendation_no,review, recommendation\n")
    history = [{"role": "system", "content": recom_prompt}]
    for index, row in subset.iterrows():
        #row = ssi.iloc[i]
        print(row.to_string())
        history.append({"role":"user","content":row.to_string()})
        completion = model.create_chat_completion(
            messages=history,
            temperature=0.7,
            response_format={
                "type": "json_object",
                "schema": {
                    "type": "object",
                    "properties": {
                        "recommendation": {"type": "string"},
                    },
                    "required": ["recommendation"],
                },
            }
        )
        answer = json.loads(completion['choices'][0]['message']['content'])["recommendation"]
        #print(type(answer))
        with open("recom_derive.csv", 'a') as file:
            file.write(f"{row['rowid']}, {row['service']},{row['issue']},{row['recommendation_no']},{row['review']} {answer}\n")
        history.pop()
        print(file)
    return 1

def main():
    here = os.path.dirname(os.path.abspath(__file__)) # lives in backend\generation
    absdatapath=os.path.normpath(os.path.join(here, '..\\data'))
    llm = Llama(
        model_path="C:/Users/shish/gxs-sentiment-analysis/backend/.model/mistral-7b-instruct-v0.2.Q5_K_M.gguf",
        n_gpu_layers=-1, # Uncomment to use GPU acceleration
        # seed=1337, # Uncomment to set a specific seed
        n_ctx=1000, # Uncomment to increase the context window
        chat_format="chatml"
    )
    # gxs_sample_gen = generate_recommendation_from_review(gxs.iloc[0:10,], recommendations_sys_prompt, llm)
    print(recom_derive(llm))

if __name__=="__main__": 
    main() 