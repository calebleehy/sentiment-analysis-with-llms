import csv, os
import pandas as pd
from backend_utils import BACKEND_ROOT, get_here, get_datapath
"""
mildly hacky pandas manipulation for merging generated text cols
loads sentiment, service, app, banking dataframes and merges them for use by eda.py
"""
HERE = get_here()
DATAPATH = get_datapath()
def main():
    ## loading everythign in
    sentiment = pd.read_csv(os.path.join(DATAPATH,'.\\sentiment.csv')) 
    service = pd.read_csv(os.path.join(DATAPATH,'.\\service.csv')) # yes we're renaming it now
    service = service[['rowid','service']]
    app = pd.read_csv(os.path.join(DATAPATH,'.\\app.csv'))
    banking = pd.read_csv(os.path.join(DATAPATH,'.\\banking.csv'))

    """
    only generated service for:
    - GXS, Trust
    onyl generated issues for:
    - GXS, Trust, and
    - neutral/negative reviews, 
    i will leave this here for yall to work with
    """

    ## merge: concat app, banking first, then merge with service on rowid
    app_banking = pd.concat([app, banking])
    app_banking = app_banking[['rowid','issue']] # comment this out if you want summary column in merged df as well
    print('app_banking\n',app_banking.sort_values(by='rowid'))
    service_issues = pd.merge(service, app_banking, on='rowid', how='left') # must be left join because i tagged service for full dataset, while issues generated only for non-Positive ones
    print('service_issues\n',service_issues)
    sentiment = sentiment[sentiment['bank'] != " MariBank"] # yeeting Maribank sentiments
    # print(sentiment)
    sentiment_service_issue = pd.merge(sentiment, service_issues, on='rowid', how='left')
    print('sentiment_service_issue\n',sentiment_service_issue)
    sentiment_service_issue.to_csv(os.path.join(DATAPATH,'./sentiment_service_issue.csv'), index = False)
    print(sentiment_service_issue.describe(include = 'all'))

if __name__ == "__main__":
    main()
