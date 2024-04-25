from typing import Sequence

from tqdm import tqdm

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