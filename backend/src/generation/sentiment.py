import json, os, sys
import pandas as pd
sys.path.insert(1, os.path.join(sys.path[0], '..'))# adds parent dir to PYTHONPATH to enable importing from there
from backend_utils import (BACKEND_ROOT, get_here, get_modelpath, get_datapath, load_model, create_csv, insert_row)
print(BACKEND_ROOT)
DATAPATH = get_datapath()
MODELPATH = get_modelpath(folder = False)
"""
implements sentiment tagging. the first step in generation portion of pipeline.
Prev: ../review_scraping.py, Next: service.py
"""
def generate_sentiment(model, datapath): 
    """
    returns a list of sentiment taggings [Positive, Neutral, Negative] for every review in data/final_data.csv (assumes it has been created)
    args: 
    - model: Llama object, 
    - datapath: will write output sent_derive.csv to here
    Notes: 
    - this function writes to output file every time a row is processed to save progress in case of crashes or other interrupts
    - the requisite system prompt is located within this function
    """
    sent_prompt = f"""
    You are a helpful assistant to a customer experience team that outputs in JSON. 
    The customer experience team need you to look at some mobile app reviews from customers and classify them based on the following: 
        1. sentiment: each review's tone, tagging them as Positive, Neutral, or Negative
    Your job is to choose between three sentiments ONLY: Positive, Negative, Neutral, and then assign them to each review. I only want one of these three things in the Sentiments column in the output, NO explanantions needed.
    """
    answers = [] 
    final_data = pd.read_csv(datapath+'/final_data.csv')
    reviews_data = final_data[['rowid', 'bank', 'review']]
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
        answers.append(answer)
    return answers

def main():
    llm = load_model(MODELPATH)
    data = pd.read_csv(DATAPATH+'/final_data.csv')
    reviews_data = data[['rowid', 'bank']]
    sentiment = generate_sentiment(llm, DATAPATH)
    reviews_data['sentiment'] = sentiment
    print(reviews_data)
    

if __name__=="__main__": 
    main() 