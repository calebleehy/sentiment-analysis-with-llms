from typing import Sequence

from tqdm import tqdm
"""
https://github.com/oobabooga/text-generation-webui/blob/main/modules/llama_cpp_python_hijack.py#L21
monkey patch to add a progress bar to the prompt processing portion of inference
not super useful for longer prompts because it does not track "thinking" time,
while being mildly risky because of overwriting library functions at runtime
tested and works though, cute feature
"""
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

        
