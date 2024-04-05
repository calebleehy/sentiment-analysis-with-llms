from llama_cpp import Llama
import csv, json, os
import pandas as pd

def create_csv(filename, headers):
    with open(filename, 'w', newline='', encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
def insert_row(filename, new_row):
    with open(filename, 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(new_row)
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
    subset = reviews_data.loc[:5]
    with open(os.path.join(datapath,".\\sent_derive.csv"), 'w') as file:
        file.write("rowid,bank,sentiment\n")
    history = [{"role": "system", "content": sent_prompt}]
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
                        "Sentiment": {"type": "string"},
                    },
                    "required": ["sentiment"],
                },
            }
        )
        answer = json.loads(completion['choices'][0]['message']['content'])["Sentiment"]
        with open(os.path.join(datapath,".\\sent_derive.csv"), 'a') as file:
            file.write(f"{row['rowid']}, {row['bank']}, {answer}\n")
        history.pop()
    return 1

def main():
    ## filepath fuckery:
    abscurrentpath = os.path.dirname(os.path.abspath(__file__)) # lives in backend\generation
    relmodelpath = '..\\model\\mistral-7b-instruct-v0.2.Q5_K_M.gguf'
    reldatapath='..\\data'
    # os.path.normpath(os.path.join(abspath, relpath))
    llm = Llama(
        model_path=os.path.normpath(os.path.join(abscurrentpath, relmodelpath)),
        n_gpu_layers=-1, # Uncomment to use GPU acceleration
        # seed=1337, # Uncomment to set a specific seed
        n_ctx=1000, # Uncomment to increase the context window
        chat_format="chatml"
    )
    absdatapath=os.path.normpath(os.path.join(abscurrentpath, reldatapath))
    print(generate_sentiment(llm, absdatapath))

if __name__=="__main__": 
    main() 