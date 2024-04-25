from llama_cpp import Llama
import csv, json, os, sys
import pandas as pd
from pathlib import Path

sys.path.insert(1, os.path.join(sys.path[0], '..'))# adds parent dir to PYTHONPATH to enable importing from there
from backend_utils import (BACKEND_ROOT, get_here, get_modelpath, get_datapath, load_model, create_csv, insert_row)
print(BACKEND_ROOT)
DATAPATH = get_datapath()
MODELPATH = get_modelpath(folder = False)

def example_generation_sequential(query_list, sysprompt, json_schema, model, temp = 0.3):
    """
    an example of how inference can be done on a list of user query strings, other functions have a broad structure similar to this
    args: 
    - query_list, python list of user query strings
    - sysprompt
    - json_schema, to be used by Llama's response_format
    - model: Llama object
    - temp: controls variability in model output, deafult 0.3
    """
    history = [{"role": "system", "content": sysprompt},]
    answers = []
    for q in query_list:
        history.append({"role": "user", "content": q})
        completion = model.create_chat_completion(
            messages=history,
            temperature=temp,
            response_format=json_schema
        )
        answer = json.loads(completion['choices'][0]['message']['content']) # gets json in string format, then converts to json
        # for k,v in answer.items():
        #answer["review"] = r
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

def main():
    test_sysprompt = """
    You are a helpful assistant that outputs in JSON. You will be given a list of statements. Determine whether they are True, or False, and then provide your reasoning. 
    """
    test_queries = ["The sky is blue.", "Calculators can add numbers together", "Water is not wet", "My favourite colour is blue"]
    test_schema = {
        "type": "json_object",
        "schema": {
            "type": "object",
            "properties": {
                "truth": {"type": "boolean"},
                "reasoning": {"type": "string"}
            },
            "required": ["truth", "reasoning"],
        },
    }
    model = load_model(MODELPATH)
    test_responses = example_generation_sequential(test_queries, test_sysprompt, test_schema, model)
    test_responses = pd.DataFrame.from_records(test_responses)
    test_responses["queries"] = test_queries
    print(test_responses)
    test_responses.to_csv(DATAPATH+'\\testoutput.csv')
    print("test responses written to data folder")

if __name__=="__main__": 
    main() 
    