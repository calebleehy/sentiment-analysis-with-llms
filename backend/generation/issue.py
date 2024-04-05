from llama_cpp import Llama
import csv, json, warnings
import pandas as pd

def create_csv(filename, headers):
    with open(filename, 'w', newline='', encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
def insert_row(filename, new_row):
    with open(filename, 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(new_row)
        
def generate_issue(model): 
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
    data = pd.read_csv('./data/final_data.csv')
    sentiment = pd.read_csv("./data/sentiment.csv")
    data["rowid"] = data.index # add in review indexing for merging later
    reviews = data[['rowid', 'bank', 'review']]
    reviews = reviews.query('bank == "GXS" | bank == "Trust"')
    subset = reviews.loc[696:]
    # output file
    with open("problem_category.csv", 'w') as file:
        file.write("rowid,bank,review,problem_category,summary\n")
    history = [{"role": "system", "content": service_prompt}]
    for index,row in subset.iterrows(): # change subset to reviews later
        # print(row)
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
                        "problem_category": {"type": "string"},
                        "summary": {"type":"string"}
                    },
                    "required": ["problem_category","summary"],
                },
            }
        )
        # extract answer as json string, load, extract desired field
        answer = json.loads(completion['choices'][0]['message']['content'])
        problem_category,summary = answer["problem_category"],answer["summary"]
        print(type(answer))
        with open("problem_category.csv", 'a') as file:
            file.write(f"{row['rowid']},{row["bank"]},{problem_category},\"{summary}\"\n")
        history.pop()
    return 1

def main():
    # create_csv("generated_recs", ["id", "topic","recommendation"])
    
    llm = Llama(
        model_path="./model/mistral-7b-instruct-v0.2.Q5_K_M.gguf",
        n_gpu_layers=-1, # Uncomment to use GPU acceleration
        # seed=1337, # Uncomment to set a specific seed
        n_ctx=1000, # Uncomment to increase the context window
        chat_format="chatml"
    )
    print(generate_issue(llm))

if __name__=="__main__": 
    main() 
    