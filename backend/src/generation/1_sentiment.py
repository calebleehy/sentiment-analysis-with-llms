from llama_cpp import Llama
import csv, json, os, sys
import pandas as pd
from pathlib import Path
sys.path.insert(1, os.path.join(sys.path[0], '..'))# adds parent dir to PYTHONPATH to enable importing from there
from backend_utils import (BACKEND_ROOT, get_here, get_modelpath, get_datapath, load_model, create_csv, insert_row)
print(BACKEND_ROOT)
DATAPATH = get_datapath()
MODELPATH = get_modelpath(folder = False)

def generate_sentiment(model, datapath): 
    """
    for each review, tag sentiment. takes loaded Llama model object as input. 
    """
    sent_prompt = f"""
    You are a helpful assistant to a customer experience team that outputs in JSON. 
    The customer experience team need you to look at some mobile app reviews from customers and classify them based on the following: 
        1. sentiment: each review's tone, tagging them as Positive, Neutral, or Negative
    Your job is to choose between three sentiments ONLY: Positive, Negative, Neutral, and then assign them to each review. I only want one of these three things in the Sentiments column in the output, NO explanantions needed.
    """
    answers = []
    final_data = pd.read_csv(datapath+'/final_data.csv')
    final_data["rowid"] = final_data.index
    reviews_data = final_data[['rowid', 'bank', 'review']]
    subset = reviews_data.loc[218:]
    with open(os.path.join(datapath,".\\sent_derive.csv"), 'w') as file:
        file.write("rowid,bank,sentiment\n")
    history = [{"role": "system", "content": sent_prompt}]
    for index, row in reviews_data.iterrows():
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
                        "Sentiment": {"type": "string"},
                    },
                    "required": ["sentiment"],
                },
            }
        )
        answer = json.loads(completion['choices'][0]['message']['content'])["Sentiment"]
        with open(os.path.join(datapath,".\\sent_derive.csv"), 'a') as file:
            file.write(f"{row['rowid']},{row['bank']},{answer}\n")
        history.pop()
    return 1

def main():
    
    # os.path.normpath(os.path.join(abspath, relpath))
    llm = load_model(MODELPATH)
    print(generate_sentiment(llm, DATAPATH))

if __name__=="__main__": 
    main() 