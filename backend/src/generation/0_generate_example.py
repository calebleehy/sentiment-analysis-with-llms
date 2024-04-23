from llama_cpp import Llama
import csv, json, os
import pandas as pd
here = os.path.dirname(os.path.abspath(__file__)) # all future filepaths are relative to here
datapath=os.path.normpath(os.path.join(here, '..\\..\\data')) # ..\data directory
modelpath=os.path.normpath(os.path.join(here, '..\\..\\model\\mistral-7b-instruct-v0.2.Q5_K_M.gguf')) # model file

def example_generation_sequential(query_list, sysprompt, json_schema, model, temp = 0.3):
    """
    an example of how inference can be done on a list of user query strings, other functions have a broad structure similar to this
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
    model = load_model()
    test_responses = example_generation_sequential(test_queries, test_sysprompt, test_schema, model)
    test_responses = pd.DataFrame.from_records(test_responses)
    print(test_responses)

if __name__=="__main__": 
    main() 
    