import csv, os
import pandas as pd
"""
very hacky pandas manipulation for merging generated text cols
"""
here = os.path.dirname(os.path.abspath(__file__)) # lives in backend\data
sentiment = pd.read_csv(os.path.join(here,'.\\sentiment.csv')) 
service = pd.read_csv(os.path.join(here,'.\\problem_category.csv')) # yes we're renaming it now
service = service[['rowid','problem_category']]
service.rename(columns={'problem_category' : 'service'})
app = pd.read_csv(os.path.join(here,'.\\app.csv'))
banking = pd.read_csv(os.path.join(here,'.\\banking.csv'))

## add rowid to final_data
data = pd.read_csv(os.path.join(here,'./final_data.csv'))
# data["rowid"] = data.index # no need for this because to_csv's `index` parameter is true by default lol
data.to_csv(os.path.join(here,'./final_data_modified.csv'), index_label = 'rowid')

"""
only generated service for:
- GXS, Trust
onyl generated issues for:
- GXS, Trust, and
- neutral/negative reviews, 
i will leave this here for yall to work with
"""

# merge: concat app, banking first, then merge with service on rowid
app_banking = pd.concat([app, banking])
app_banking = app_banking[['rowid','issue']] # comment this out if you want summary column in merged df as well
print('app_banking\n',app_banking.sort_values(by='rowid'))
service_issues = pd.merge(service, app_banking, on='rowid', how='left') # must be left join because i tagged service for full dataset, while issues generated only for non-Positive ones
print('service_issues\n',service_issues)
# print(sentiment)
sentiment = sentiment[sentiment['bank'] != " MariBank"] # yeeting Maribank sentiments
# print(sentiment)
sentiment_service_issue = pd.merge(sentiment, service_issues, on='rowid', how='left')
print('sentiment_service_issue\n',sentiment_service_issue)
sentiment_service_issue.to_csv(os.path.join(here,'./sentiment_service_issue.csv'), index = False)
print(sentiment_service_issue.describe(include = 'all'))
## merging 
# final_left = pd.merge(sentiment, service, on='Review Number')
# final_right = pd.merge(intent,ssi, on='Review Number')
# final_final = pd.merge(final_left, final_right, on='Review Number')

# # final_final.rename(columns={
    # # "Review Number":"rowid",
    # # "Sentiment":"sentiment"
    # # "Service Category": "service",
    # # "Recommendation":"recommendation",
    # # "Intent Category":"intent"
    # # },inplace=True, level=None, errors='ignore')
# print(final_final.head())
# final_final.to_csv('./data/merged.csv', index=False, quoting=csv.QUOTE_NONNUMERIC, quotechar='"')


# merged = pd.read_csv("./data/merged.csv")
# print(merged.iloc[:5])
# merged.rename(columns={"Review Number":"rowid","Sentiment":"sentiment","Service Category": "service",
    # "Recommendation":"recommendation",
    # "Intent Category":"intent"
    # },inplace=True, level=None, errors='raise')
    
# reviews = pd.read_csv('./data/final_data.csv')
# reviews["rowid"] = reviews.index+2
# print(merged.iloc[:5])
# print(reviews.loc[:5,["rowid","review"]])  # [:5,["rowid","review"]]

# merged_fixed = pd.merge(merged,reviews.loc[:,["rowid","review"]], how='left', on='rowid')
# print(merged_fixed.iloc[:20,:])
# merged_fixed.to_csv('./data/merged_fixed.csv', index=False, quoting=csv.QUOTE_NONNUMERIC, quotechar='"')