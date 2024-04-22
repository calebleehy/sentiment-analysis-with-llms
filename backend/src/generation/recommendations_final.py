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

def generate_recommendation_from_review(reviews_df, model):
    create_csv("generated_recs", ["id", "topic","recommendation"])
    recommendations_sys_prompt = f"""
        You are a helpful assistant to a customer experience team that outputs in JSON. Referring to the list of mobile app reviews you will be provided, perform the following tasks: 
        1. give the topic of each review in 5 words or less.
        2. give a recommendation to the customer experience team on how to respond to the review
        """
    history = [{"role": "system", "content": recommendations_sys_prompt},]
    answers = []
    for i in range(len(reviews_df)):
        r = reviews_df.loc[i,'review']
        history.append({"role": "user", "content": r})
        completion = model.create_chat_completion(
            messages=history,
            temperature=0.7,
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
        insert_row("generated_recs", [a['id'], a['topic'], a['recommendation']])
    return answers

def rec_from_sent_serv_intent(model): 
    # given sentiment, service, intent, produce recommendation in 5 words or less
    rec_prompt = f"""
    You are a helpful assistant to a customer experience team that outputs in JSON. 
    The customer experience team has already looked at some mobile app reviews from customers and classified them based on the following: 
        1. sentiment: each review's tone was tagged as Positive, Neutral, or Negative
        2. service: the aspect of the app/service that the review is relating to
        3. intent: each review was tagged as a Request, Opinion, Issue, or Feedback
    Your job is to come up with a Recommendation in 5 words or less for each review. We do NOT want a potential response to the customer, but instead we want a recommended followup action. 
    Once again, 5 WORDS OR LESS per recommendation. 
    """
    answers = []
    sentiment = pd.read_csv('./data/sentiment.csv')
    service = pd.read_csv('./data/service.csv')
    intent = pd.read_csv('./data/intent.csv')
    # string/csv wrangling
    ssi = pd.merge(sentiment, service, on='Review Number')
    ssi = pd.merge(ssi, intent, on='Review Number')
    print(ssi.head())
    # ssi = ssi[0:10]
    with open("rec_from_sent_serv_intent.csv", 'w') as file:
        file.write("Review Number,Recommendation\n")
    history = [{"role": "system", "content": rec_prompt}]
    for i in range(len(ssi)):
        row = ssi.iloc[i]
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
                        "recommendation": {"type": "string"},
                    },
                    "required": ["recommendation"],
                },
            }
        )
        answer = json.loads(completion['choices'][0]['message']['content'])["recommendation"]
        print(type(answer))
        with open("rec_from_sent_serv_intent.csv", 'a') as file:
            file.write(f"{ssi.loc[i,"Review Number"]},\"{answer}\"\n")
        history.pop()
    return 1

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
    
    llm = Llama(
        model_path="./model/mistral-7b-instruct-v0.2.Q5_K_M.gguf",
        n_gpu_layers=-1, # Uncomment to use GPU acceleration
        # seed=1337, # Uncomment to set a specific seed
        n_ctx=1000, # Uncomment to increase the context window
        chat_format="chatml"
    )
    # gxs_sample_gen = generate_recommendation_from_review(gxs.iloc[0:10,], recommendations_sys_prompt, llm)
    print(rec_from_sent_serv_intent(llm))

if __name__=="__main__": 
    main() 