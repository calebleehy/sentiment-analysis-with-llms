from llama_cpp import Llama
import csv, json, warnings
import pandas as pd

def create_csv(filename, headers):
    with open(filename, 'w', newline='', encoding="utf-8-sig") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
def insert_row(filename, new_row):
    with open(filename, 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(new_row)

def generate_recommendation_from_review(reviews_df,sysprompt, model):
    history = [{"role": "system", "content": sysprompt},]
    answers = []
    for i in range(len(reviews_df)):
        r = reviews_df.loc[i,'review']
        history.append({"role": "user", "content": r})
        completion = model.create_chat_completion(
            # model="local-model", # this field is currently unused
            messages=history,
            temperature=0.7,
            # stream=True,
            response_format={
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

def rec_from_sent_serv_intent():
    history = [{"role": "system", "content": sysprompt},]
    answers = []

def main():
    # from 
    data = pd.read_csv('./data/final_data.csv')
    data["id"] = data.index # add in review indexing for matching later
    overall_reviews = data[['id', 'bank', 'review']]
    # partition by bank in case we have time to do competitor analysis related things later
    gxs = overall_reviews.query('bank == "GXS"')
    trust = overall_reviews.query('bank == "Trust"')
    maribank = overall_reviews.query('bank == "MariBank"')
    
    create_csv("generated_recs", ["id", "topic","recommendation"])
    
    sentiment = pd.read_csv('./data/sentiment.csv')
    service = pd.read_csv('./data/service.csv')
    intent = pd.read_csv('./data/intent.csv')
    
    llm = Llama(
        model_path="./model/mistral-7b-instruct-v0.2.Q5_K_M.gguf",
        n_gpu_layers=-1, # Uncomment to use GPU acceleration
        # seed=1337, # Uncomment to set a specific seed
        n_ctx=2048, # Uncomment to increase the context window
        chat_format="chatml"
    )

    recommendations_sys_prompt = f"""
    You are a helpful assistant to a customer experience team that outputs in JSON. Referring to the list of mobile app reviews you will be provided, perform the following tasks: 
    1. give the topic of each review in 5 words or less.
    2. give a recommendation to the customer experience team on how to respond to the review
    """
    # gxs_sample_gen = generate_recommendation_from_review(gxs.iloc[0:10,], recommendations_sys_prompt, llm)
    
    for g in gxs_sample_gen:
        # print(g)
        insert_row("generated_recs", [g['id'], g['topic'], g['recommendation']])

if __name__=="__main__": 
    main() 