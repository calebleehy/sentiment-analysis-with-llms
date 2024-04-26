import pandas as pd
from backend_utils import get_datapath
"""
Cleans up LLM output and merges everything into merged.csv, and then prepares eda_for_reco.csv
"""
DATAPATH = get_datapath()

def main():
    # MERGING DATA
    ## processed scraped data
    scraped_df = pd.read_csv(DATAPATH + './final_data.csv')
    scraped_df = scraped_df.loc[:, ~scraped_df.columns.isin(['developer_response'])]
    #print(scraped_df)

    ## generated sentiment, service and issue
    processed_df = pd.read_csv(DATAPATH + "./sentiment_service_issue.csv")
    processed_df = processed_df.loc[:, ~processed_df.columns.isin(['bank'])]
    #print(processed_df)

    ## merge on common key rowid
    merged_df_init = pd.merge(scraped_df, processed_df, on = 'rowid')

    ## some cleaning and renaming
    merged_df_init.rename(columns = {'problem_category': 'service'}, inplace=True)
    merged_df_init['sentiment'] = merged_df_init['sentiment'].replace([' Negative', ' Neutral', ' Neutural', ' Positive'], ['Negative', 'Neutral', 'Neutral', 'Positive'])
    merged_df_init['service'] = merged_df_init['service'].replace(['bank'], ['banking'])
    merged_df_init['issue'] = merged_df_init['issue'].replace(
        ['lack_of_expected_features_or_functionality',
        'technical difficulties during registration and setup',
        'technical issues',
        'user interface and design issues',
        'Account Access Issues',
        'Account issues',
        'Interest rate concerns',
        'login problems'],

        ['lack of expected features or functionality',
        'registration and setup',
        'technical glitches',
        'UI/UX',
        'account issues',
        'account issues',
        'interest rate concerns',
        'login issues']
        )

    clean_merged_df = merged_df_init.dropna(subset=['service'])

    def capitalize_first_letter(df, column_name):
        df[column_name] = df[column_name].apply(lambda x: x.capitalize() if isinstance(x, str) else x)

    capitalize_first_letter(clean_merged_df, 'service')
    clean_merged_df['service'] = clean_merged_df['service'].str.replace('_', ' ')
    clean_merged_df['issue'] = clean_merged_df['issue'].astype('category')
    capitalize_first_letter(clean_merged_df, 'issue')
    clean_merged_df['issue'] = clean_merged_df['issue'].apply(lambda x: x.replace('_', ' ') if isinstance(x, str) else x)
    clean_merged_df['issue'] = clean_merged_df['issue'].replace(['Ui/ux'], ['UI/UX'])
    clean_merged_df['issue'] = clean_merged_df['issue'].fillna('-')
    merged_df = clean_merged_df
    #print(clean_merged_df)

    ## convert table to csv
    merged_df.to_csv(DATAPATH + "./merged.csv", index = False)


    # FIND TOP 2 NEGATIVE ISSUES IN GXS

    ## filter GXS data only
    gxs = merged_df[merged_df['bank'] == 'GXS']
    #print(gxs)

    ## filter negative sentiment of GXS
    gxs_neg = gxs[gxs['sentiment'] == 'Negative']
    gxs_neg.reset_index(drop=True, inplace=True)

    ## filter rows that have an issue
    gxs_neg = gxs_neg[gxs_neg['issue'] != '-']
    #print(gxs_neg)

    ## aggregate count of services
    def service_count_agg_function(group):
        # Get the group column value for this group
        group_value = group['service'].iloc[0]
        print(group_value)
        # Perform aggregation operations and return a DataFrame
        aggregated_df = pd.DataFrame({
            'service': [group_value],
            'count': [group['rowid'].count()]
        })
        return aggregated_df

    gxs_neg_service_by_count = gxs_neg.groupby('service').apply(service_count_agg_function)
    gxs_neg_service_by_count.reset_index(drop=True, inplace=True)
    #print(gxs_neg_service_by_count)

    ## find the top service -- service with the most count
    max_count_row = gxs_neg_service_by_count.loc[gxs_neg_service_by_count['count'].idxmax()]
    service_1 = max_count_row['service']
    #print(service_1)

    ## filter rows with top service
    service_1_df = gxs_neg[gxs_neg['service'] == service_1]
    service_1_df.reset_index(drop=True, inplace=True)
    #print(service_1_df)

    ## aggregate count of issues in service_1
    def issue_count_agg_function(group):
        results = []
        # Iterate over all the values in the 'issue' column for this group
        for group_value in group['issue'].unique():
            # Check if group_value is not None
            if pd.notna(group_value):
                # Perform aggregation operations and append the result to the list
                aggregated_result = {
                    'issue': group_value,
                    'count': group.loc[group['issue'] == group_value, 'rowid'].count()
                    # Add more aggregation operations as needed
                }
                results.append(aggregated_result)
        aggregated_df = pd.DataFrame(results)
        return aggregated_df

    gxs_neg_issue_by_count_1 = service_1_df.groupby('issue').apply(issue_count_agg_function).dropna()

    ## filter out rows with issue = 'Other'
    gxs_neg_issue_by_count_1_no_other = gxs_neg_issue_by_count_1[gxs_neg_issue_by_count_1['issue'] != 'Other']

    ## sort issues by most frequent
    gxs_neg_issue_by_count_1_no_other = gxs_neg_issue_by_count_1_no_other.sort_values(by = 'count', ascending = False)
    gxs_neg_issue_by_count_1_no_other.reset_index(drop=True, inplace=True)
    #print(gxs_neg_issue_by_count_1_no_other)

    # Find the top 2 most frequent issues
    issue_1 = gxs_neg_issue_by_count_1_no_other['issue'].values[0]
    issue_2 = gxs_neg_issue_by_count_1_no_other['issue'].values[1]
    #print(issue_1)
    #print(issue_2)


    # TOP ISSUE -- issue_1

    ## filter rows with issue_1
    issue_1_df = gxs_neg[(gxs_neg['service'] == service_1) & (gxs_neg['issue'] == issue_1)]
    issue_1_df.reset_index(drop=True, inplace=True)
    #print(issue_1_df)

    ## get needed columns for recommendation
    issue_1_df['recommendation_no'] = 'R1'
    issue_1_recommend = issue_1_df[['rowid', 'service', 'issue','recommendation_no','review']]
    #print(issue_1_recommend)


    # 2ND TOP ISSUE -- issue_2

    ## filter rows with issue_2
    issue_2_df = gxs_neg[(gxs_neg['service'] == service_1) & (gxs_neg['issue'] == issue_2)]
    issue_2_df.reset_index(drop=True, inplace=True)
    #print(issue_2_df)

    ## get needed columns for recommendation
    issue_2_df['recommendation_no'] = 'R2'
    issue_2_recommend = issue_2_df[['rowid', 'service', 'issue', 'recommendation_no', 'review']]
    #print(issue_2_recommend)


    # FIND TOP ISSUE TO KEEP UP WITH TRUST BANK

    ## filter trust bank data
    trust = merged_df[merged_df['bank'] == 'Trust'].dropna()
    trust.reset_index(drop=True, inplace=True)
    #print(trust)

    ## filter negative sentiment of trust
    trust_neg = trust[trust['sentiment'] == 'Negative']
    trust_neg.reset_index(drop=True, inplace=True)
    #print(trust_neg)

    ## filter rows that have an issue
    trust_neg = trust_neg[trust_neg['issue'] != '-']

    ## aggregate count of services
    trust_neg_service_by_count = trust_neg.groupby('service').apply(service_count_agg_function)
    trust_neg_service_by_count.reset_index(drop=True, inplace=True)
    #print(trust_neg_service_by_count)

    ## find the service with the least count
    min_count_row_service_3 = trust_neg_service_by_count.loc[trust_neg_service_by_count['count'].idxmin()]
    service_3 = min_count_row_service_3['service']
    #print(service_3)

    ## filter rows with least frequent service -- service_3
    service_3_df = trust_neg[trust_neg['service'] == service_3]
    service_3_df.reset_index(drop=True, inplace=True)
    #print(service_3_df)

    ## aggregate count of issues in service_3
    trust_neg_issue_by_count = service_3_df.groupby('issue').apply(issue_count_agg_function).dropna()

    ## filter out rows with issue = 'Other'
    trust_neg_issue_by_count_no_other = trust_neg_issue_by_count[(trust_neg_issue_by_count['issue'] != 'Other')]

    ## sort issues by least frequent
    trust_neg_issue_by_count_no_other = trust_neg_issue_by_count_no_other.sort_values(by = 'count')
    trust_neg_issue_by_count_no_other.reset_index(drop=True, inplace=True)
    #print(trust_neg_issue_by_count_no_other)

    ## get issue_3 -- least frequent issue in trust also found in GXS
    for i in trust_neg_issue_by_count_no_other.index:
        issue_3 = trust_neg_issue_by_count_no_other['issue'][i]
        # filter rows with issue_3 in GXS
        issue_3_df = gxs[(gxs['service'] == service_3) & (gxs['issue'] == issue_3)]
        if len(issue_3_df) != 0:
            break

    #print(issue_3)
    issue_3_df.reset_index(drop=True, inplace=True)
    #print(issue_3_df)

    ## get needed columns for recommendation
    issue_3_df['recommendation_no'] = 'R3'
    issue_3_recommend = issue_3_df[['rowid', 'service', 'issue','recommendation_no','review']]
    #print(issue_3_recommend)


    # MERGE ALL 3 ISSUES' RECOMMENDATION TABLES
    combine_issue_recommend = pd.concat([issue_1_recommend, issue_2_recommend, issue_3_recommend])
    combine_issue_recommend.reset_index(drop=True, inplace=True)
    #print(combine_issue_recommend)

    # CONVERT TABLE TO CSV
    combine_issue_recommend.to_csv(DATAPATH + "./eda_for_reco.csv", index = False)
if __name__ == '__main__':
    main()
