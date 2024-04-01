from llama_cpp import Llama
import csv, json, warnings
import pandas as pd

llm = Llama(
    model_path="./model/mistral-7b-instruct-v0.2.Q5_K_M.gguf",
    n_gpu_layers=16, # Uncomment to use GPU acceleration
    # seed=1337, # Uncomment to set a specific seed
    n_ctx=2048, # Uncomment to increase the context window
    chat_format="chatml"
)

def generate_each_review(reviews_df, sysprompt, json_schema):
    history = [{"role": "system", "content": sysprompt},]
    answers = []
    for i in range(len(reviews_df)):
        r = reviews_df.loc[i,'review']
        history.append({"role": "user", "content": r})
        completion = llm.create_chat_completion(
            messages=history,
            temperature=0.7,
            # MODIFY THE BELOW FORMAT TO
            response_format=json_schema
        )
        answer = json.loads(completion['choices'][0]['message']['content']) # gets json in string format, then converts to json
        # for k,v in answer.items():
        #answer["review"] = r
        answer["id"] = reviews_df.loc[i,'id']
        answers.append(answer)
        history.pop()
    for a in answers:
        print(a)
    return answers
"""
 EXAMPLE JSON SCHEMA FORMAT: modify the `properties` field and `required` field

{
    "type": "json_object",
    "schema": {
        "type": "object",
        "properties": {
            "topic": {"type": "string"},
            "recommendation": {"type": "string"}
        },
        "required": ["topic", "recommendation"],
    },
}

"""