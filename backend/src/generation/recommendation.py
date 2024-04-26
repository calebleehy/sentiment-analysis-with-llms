import json, sys, time, os
import pandas as pd
sys.path.insert(1, os.path.join(sys.path[0], '..'))# adds parent dir to PYTHONPATH to enable importing from there
from backend_utils import (BACKEND_ROOT, get_here, get_modelpath, get_datapath, load_model, create_csv, insert_row)
print(BACKEND_ROOT)
DATAPATH = get_datapath()
MODELPATH = get_modelpath(folder = False)
"""
non-functional attempt at generating recommendations by local LLM
"""
def recom_derive(datapath, modelpath): 
    # given sentiment, service, intent, produce recommendation in 5 words or less
    
    app_data = pd.read_csv(datapath+'/eda_for_reco.csv')    
    issue_counts = app_data['issue'].value_counts().reset_index()
    issue_counts.columns = ['issue', 'count']
    sorted_issues = issue_counts['issue'].tolist()
    app_data['issue'] = pd.Categorical(app_data['issue'], categories=sorted_issues, ordered=True)
    sorted_df = app_data.sort_values(by='issue')
    print(sorted_df)
    unique_issues = sorted_df['issue'].unique().tolist()
    issues_dict = {}
    for issue in unique_issues:
        issue_context = sorted_df['review'].unique().tolist() # list of reviews with this issue
        issues_dict[issue] = issue_context
    answers = []  
    with open("recom_derive.csv", 'w') as file:
        file.write("timestamp,issue,'recommendation_no',recommendation\n")
    recommendation_no = 1
    for key,value in issues_dict.items():
        recom_prompt = f"""
        You are a helpful assistant to a customer experience team that outputs in JSON. 
        """
        user_message = f"""
        Currently, some customers are facing the following issue: {key}
        Please recommend a solution to this in LESS THAN 10 words. 
        Additionally, here are some real customer complaints as context for your decision making: 
        {str(value)}
        """
        ctx_window = (int(len(user_message) / 10.0)+50) * 10 # add some overhead for system prompt
        llm = load_model(modelpath, ctx_window)
        
        history = [{"role": "system", "content": recom_prompt}]
        history.append({"role":"user","content":user_message})
        completion = llm.create_chat_completion(
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
        #print(type(answer))
        with open("recom_derive.csv", 'a') as file:
            file.write(f"{time.time()},{key},R{recommendation_no},\"{answer}\"\n")
        recommendation_no+=1        
    return 1

def main():
    # llm = load_model(MODELPATH, 10000)    
    # gxs_sample_gen = generate_recommendation_from_review(gxs.iloc[0:10,], recommendations_sys_prompt, llm)
    print(recom_derive(DATAPATH, MODELPATH))

if __name__=="__main__": 
    main() 