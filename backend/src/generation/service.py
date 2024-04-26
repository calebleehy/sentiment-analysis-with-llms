import json, os, sys
import pandas as pd
sys.path.insert(1, os.path.join(sys.path[0], '..'))# adds parent dir to PYTHONPATH to enable importing from there
from backend_utils import (BACKEND_ROOT, get_here, get_modelpath, get_datapath, load_model, create_csv, insert_row)
print(BACKEND_ROOT)
DATAPATH = get_datapath()
MODELPATH = get_modelpath(folder = False)
"""
implements service tagging
Prev: sentiment.py, Next: issue.py
"""
def generate_service(model, datapath): 
    """
    returns (service tagging,summary) for each review in data/final_data.csv (assumes it has been created)
    args: 
    - model: Llama object, 
    - datapath: will read final_data.csv from here, and write output service.csv to here
    Notes: 
    - we define service as a broader category of issue faced by customers: [banking, app]-type issue
    - the summary and service tagging facilitates issue generation downstream
    - this function writes to output file every time a row is processed to save progress in case of crashes or other interrupts
    - the requisite system prompt is located within this function
    """
    # given review, label service aspect: banking or app
    service_prompt = f"""
    You are a helpful assistant to a customer experience team that outputs in JSON. 
    You will be provided with a list of app store reviews for digital banking apps. Each customer review is unhappy with or suggesting some improvement for some service aspect (banking or app). 
    Your job is to:
    - tag each review as either a banking issue or an app issue. 
        - ONLY reply with "banking" or "app". 
    - summarise each review in 5 words or less
    """
    answers = []
    final_data = pd.read_csv(datapath+'/final_data.csv')
    sentiment = pd.read_csv(datapath+'/sent_derive.csv') # implement ability to opt for non-Positive filtering later
    reviews = final_data[['rowid', 'bank', 'review']]
    reviews = reviews.query('bank == "GXS" | bank == "Trust"')
    with open(os.path.join(datapath,".\\service.csv"), 'w') as file:
        file.write("rowid,bank,service,summary\n")
    history = [{"role": "system", "content": service_prompt}]
    for index,row in reviews.iterrows(): 
        print(row.to_string())
        history.append({"role":"user","content":row.to_string()})
        completion = model.create_chat_completion(
            messages=history,
            temperature=0.3,
            response_format={
                "type": "json_object",
                "schema": {
                    "type": "object",
                    "properties": {
                        "problem_category": {"type": "string"},
                        "summary": {"type":"string"}
                    },
                    "required": ["problem_category","summary"],
                },
            }
        )
        # extract answer as json string, load, extract desired field
        answer = json.loads(completion['choices'][0]['message']['content'])
        answer['rowid'] = row['rowid']
        service, summary = answer["problem_category"],answer["summary"]
        # print(type(answer))
        with open(os.path.join(datapath,".\\service.csv"), 'a') as file:
            file.write(f"{row['rowid']},{row['bank']},{service},\"{summary}\"\n")
        history.pop()
        answers.append(answer)
    return answers

def main():
    llm = load_model(MODELPATH, 1000)
    data = pd.read_csv(DATAPATH+'/final_data.csv')
    rowid_bank = data[['rowid', 'bank']]
    service = generate_service(llm, DATAPATH) # list of json's
    service = pd.DataFrame.from_records(service)
    service = pd.merge(rowid_bank, service, on='rowid')
    print(service)

if __name__=="__main__": 
    main() 
    