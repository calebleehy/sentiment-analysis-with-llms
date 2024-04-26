import pandas as pd
from datetime import datetime
from json import loads, dumps


# PREPARATION

## all data without recommendations
merged_df = pd.read_csv("../data/merged.csv")
#print(merged_df)

## recommendation data
reco_df = pd.read_csv("../data/recommendation.csv")
#print(reco_df)

## some cleaning
merged_df['date'] = pd.to_datetime(merged_df['date'], format="%Y-%m-%d %H:%M:%S")
merged_df['date'] = merged_df['date'].dt.date
merged_df['rating'] = merged_df['rating'].astype(int)
merged_df['issue'] = merged_df['issue'].replace(['Ui/ux'], ['UI/UX'])
columns_order = ['rowid', 'date', 'client', 'bank', 'rating', 'sentiment', 'service', 'issue', 'review']
merged_df = merged_df[columns_order]
#print(merged_df)

## NPS function
def nps(df):

  # if df is empty
  if len(df) == 0:
    return "NA"

  # in case there are no negative/positive sentiment tagged reviews
  try:
    negative = df['sentiment'].value_counts()['Negative']
  except:
    negative = 0
  try:
    positive = df['sentiment'].value_counts()['Positive']
  except:
    positive = 0

  positive_percent = (positive/len(df)) * 100
  negative_percent = (negative/len(df)) * 100
  nps_score = round(positive_percent - negative_percent, 1)
  return nps_score


# FULL TABLE WITHOUT RECOMMENDATION
full_df = merged_df.iloc[:, 1:]
full_df['date'] = full_df['date'].apply(lambda x: x.strftime("%Y-%m-%d"))
full_df = full_df.astype(str)
#print(full_df)


# SERVICE, ISSUE, RECOMMENDATION
serv_issue_rec_df = reco_df[['service', 'issue', 'recommendation']]
#print(serv_issue_rec_df)


# BANK, NPS
banks = merged_df.bank.unique()
bank_nps_list = []

for bank in banks:
  # filter that bank only
  bank_df = merged_df[merged_df['bank'] == bank]
  nps_score = nps(bank_df)
  bank_nps_list.append([bank, nps_score])

bank_nps_df = pd.DataFrame(bank_nps_list, columns = ["bank", "nps"])
#print(bank_nps_df)


# SERVICE, ISSUE, FREQUENCY (FOR TOP 5 MOST FREQUENT ISSUES IN EACH SERVICE)
gxs_neg_df = merged_df[(merged_df['bank'] == 'GXS') & (merged_df['sentiment'] == 'Negative')]
services = gxs_neg_df.service.unique()
serv_issue_freq_list = []

for service in services:
  service_df = gxs_neg_df[gxs_neg_df['service'] == service]
  issues = service_df.issue.unique()
  for issue in issues:
    issue_df = service_df[service_df['issue'] == issue]
    freq = len(issue_df)
    serv_issue_freq_list.append([service, issue, freq])

serv_issue_freq_df = pd.DataFrame(serv_issue_freq_list, columns = ["service", "issue", "frequency"])
serv_issue_freq_df = serv_issue_freq_df[(serv_issue_freq_df["issue"] != "none") & (serv_issue_freq_df["issue"] != "-")].dropna()
serv_issue_freq_df = serv_issue_freq_df.groupby('service').apply(lambda x: x.sort_values(by = 'frequency', ascending = False).head(5))
serv_issue_freq_df = serv_issue_freq_df.reset_index(drop=True)
#print(serv_issue_freq_df)


# MONTH-YEAR, NPS
gxs_df = merged_df[merged_df['bank'] == 'GXS']
month_nps_list = []

## sort in chronological order
sorted_df = gxs_df.sort_values(by = ['date'])
sorted_df['date'] = sorted_df['date'].apply(lambda x: x.strftime("%m-%Y"))

for month in sorted_df.date.unique():
  curr_month_df = sorted_df[sorted_df['date'] == month]
  nps_score = nps(curr_month_df)
  month_nps_list.append([month, nps_score])

month_nps_df = pd.DataFrame(month_nps_list, columns = ["month", "nps"])
#print(month_nps_df)


# BANK, SERVICE, FREQUENCY(%)
banks = merged_df.bank.unique()
services = ["App", "Banking"]
bank_serv_freq_list = []

for bank in banks:
  bank_neg_df = merged_df[(merged_df['bank'] == bank) & (merged_df['sentiment'] == 'Negative')]
  bank_df = merged_df[merged_df['bank'] == bank]
  for service in services:
    service_df = bank_neg_df[bank_neg_df['service'] == service]
    freq = len(service_df)
    freq_percent = round(freq/len(bank_df)*100, 1)
    bank_serv_freq_list.append([bank, service, freq_percent])

bank_serv_freq_df = pd.DataFrame(bank_serv_freq_list, columns = ["bank", "service", "frequency (%)"])
bank_serv_freq_df = bank_serv_freq_df[bank_serv_freq_df["service"] != "none"].dropna()
bank_serv_freq_df = bank_serv_freq_df.sort_values(by = 'frequency (%)', ascending = False).head(5)
bank_serv_freq_df = bank_serv_freq_df.reset_index(drop=True)
#print(bank_serv_freq_df)


# BANK, SERVICE, ISSUE (TOP 5), FREQUENCY(%)

## get frequency of each issue in each service for GXS
services = merged_df.service.unique()
gxs_serv_issue_freq_list = []

gxs_neg_df = merged_df[(merged_df['bank'] == 'GXS')  & (merged_df['sentiment'] == 'Negative')]
gxs_df = merged_df[merged_df['bank'] == 'GXS']

for service in services:
  service_df = gxs_neg_df[gxs_neg_df['service'] == service]
  issues = service_df.issue.unique()
  for issue in issues:

    issue_df = service_df[service_df['issue'] == issue]
    freq = len(issue_df)
    freq_percent = round(freq/len(gxs_df)*100, 1)
    gxs_serv_issue_freq_list.append(['GXS', service, issue, freq_percent])

gxs_serv_issue_freq_df = pd.DataFrame(gxs_serv_issue_freq_list, columns = ["bank", "service", "issue", "gxs_frequency (%)"])
gxs_serv_issue_freq_df = gxs_serv_issue_freq_df[(gxs_serv_issue_freq_df["issue"] != "none")  & (gxs_serv_issue_freq_df["issue"] != "-")].dropna()

gxs_serv_issue_freq_df['service_issue'] = gxs_serv_issue_freq_df['service'] + gxs_serv_issue_freq_df['issue']
#print(gxs_serv_issue_freq_df)

## get frequency of each issue in each service for trust
services = merged_df.service.unique()
trust_serv_issue_freq_list = []

trust_neg_df = merged_df[(merged_df['bank'] == 'Trust') & (merged_df['sentiment'] == 'Negative')]
trust_df = merged_df[(merged_df['bank'] == 'Trust')]

for service in services:
  service_df = trust_neg_df[trust_neg_df['service'] == service]
  issues = service_df.issue.unique()
  for issue in issues:

    issue_df = service_df[service_df['issue'] == issue]
    freq = len(issue_df)
    freq_percent = round(freq/len(trust_df)*100, 1)
    trust_serv_issue_freq_list.append(['Trust', service, issue, freq_percent])

trust_serv_issue_freq_df = pd.DataFrame(trust_serv_issue_freq_list, columns = ["bank", "service", "issue", "trust_frequency (%)"])
trust_serv_issue_freq_df = trust_serv_issue_freq_df[(trust_serv_issue_freq_df["issue"] != "none")  & (trust_serv_issue_freq_df["issue"] != "-")].dropna()

trust_serv_issue_freq_df['service_issue'] = trust_serv_issue_freq_df['service'] + trust_serv_issue_freq_df['issue']
#print(trust_serv_issue_freq_df)

## merge the two tables together to find common issues in both banks
trust_in_gxs_df = pd.merge(gxs_serv_issue_freq_df, trust_serv_issue_freq_df, on='service_issue', how='inner')

## sort by least trust frequency
trust_in_gxs_df = trust_in_gxs_df.sort_values(by = 'trust_frequency (%)', ascending = True)
#print(trust_in_gxs_df)

## form the table (top 5 issues for each service for each bank)
banks = merged_df.bank.unique()
services = ["App", "Banking"]
# pick top 5 of each service
app_issues = ["Account issues", "Long wait times", "Difficulty applying credit card, savings account", "UI/UX", "Registration and setup"]
bank_issues = ["Interest rate concerns", "Application rejection", "Account issues","Long wait times","Technical glitches"]
bank_serv_issue_freq_list = []

for bank in banks:
  bank_neg_df = merged_df[(merged_df['bank'] == bank)  & (merged_df['sentiment'] == 'Negative')]
  bank_df = merged_df[(merged_df['bank'] == bank)  & (merged_df['sentiment'] == 'Negative')]
  for service in services:
    service_df = bank_neg_df[bank_neg_df['service'] == service]
    issues = service_df.issue.unique()

    for issue in issues:
      issue_df = service_df[service_df['issue'] == issue]

      if service == "App":
        sel_issues = app_issues
      else:
        sel_issues = bank_issues

      if issue in sel_issues:
        freq = len(issue_df)
        freq_percent = round(freq/len(bank_df)*100,1)
        bank_serv_issue_freq_list.append([bank, service, issue, freq_percent])

bank_serv_issue_freq_df = pd.DataFrame(bank_serv_issue_freq_list, columns = ["bank", "service", "issue", "frequency (%)"])
bank_serv_issue_freq_df = bank_serv_issue_freq_df[(bank_serv_issue_freq_df["issue"] != "none")  & (bank_serv_issue_freq_df["issue"] != "-")].dropna()
#print(bank_serv_issue_freq_df)


# ISSUE, RECOMMENDATION, WHAT-IF NPS

## get issue 1, 2, 3
issues_list = []
issues = reco_df.issue
for issue in issues:
  issues_list.append(issue)

issue_1, issue_2, issue_3 = issues_list
#print(issue_1)
#print(issue_2)
#print(issue_3)

## get recommendation 1, 2, 3
rec_list = []
recommendations = reco_df.recommendation
for rec in recommendations:
  rec_list.append(rec)

rec_1, rec_2, rec_3 = rec_list
#print(rec_1)
#print(rec_2)
#print(rec_3)

## remove rows of GXS reviews that are negative and issue_1
condition1 = gxs_df['sentiment'] == "Negative"
condition2 = gxs_df['issue'] == issue_1
combined_condition = condition1 & condition2

resolve_issue_1_df = gxs_df[~combined_condition]
resolve_issue_1_df['recommendation'] = rec_1
resolve_issue_1_df['resolved_issue'] = issue_1
#print(resolve_issue_1_df)

## remove rows of GXS reviews that are negative and issue_2
condition3 = gxs_df['issue'] == issue_2
combined_condition_2 = condition1 & condition3

resolve_issue_2_df = gxs_df[~combined_condition_2]
resolve_issue_2_df['recommendation'] = rec_2
resolve_issue_2_df['resolved_issue'] = issue_2
#print(resolve_issue_2_df)

## remove rows of GXS reviews that are negative and issue_3
condition4 = gxs_df['issue'] == issue_3
combined_condition_3 = condition1 & condition4

resolve_issue_3_df = gxs_df[~combined_condition_3]
resolve_issue_3_df['recommendation'] = rec_3
resolve_issue_3_df['resolved_issue'] = issue_3
#print(resolve_issue_3_df)

## remove rows of GXS reviews that are negative and all issues
condition5 = (gxs_df['issue'] == issue_1) | (gxs_df['issue'] == issue_2) | (gxs_df['issue'] == issue_3)
combined_condition_4 = condition1 & condition5

resolve_combined_df = gxs_df[~combined_condition_4]
resolve_combined_df['recommendation'] = 'Combined'
resolve_combined_df['resolved_issue'] = 'All issues'
#print(resolve_combined_df)

## form the table
resolve_rec_df = pd.concat([resolve_issue_1_df, resolve_issue_2_df, resolve_issue_3_df, resolve_combined_df])
resolve_rec_df = resolve_rec_df[['resolved_issue', 'recommendation', 'sentiment']]
#print(resolve_rec_df)

recommendations = resolve_rec_df.recommendation.unique()
rec_nps_list = []

for rec in recommendations:
  rec_df = resolve_rec_df[resolve_rec_df['recommendation'] == rec]
  resolved_issue = rec_df.at[0, 'resolved_issue']
  nps_score = nps(rec_df)
  rec_nps_list.append([resolved_issue, rec, nps_score])

whatif_rec_nps_df = pd.DataFrame(rec_nps_list, columns = ["issue", "recommendation", "nps"])
#print(whatif_rec_nps_df)


# BANK, NPS (USING WHAT-IF NPS FOR GXS FOR ISSUE 3)

condition4 = merged_df['issue'] == issue_3
condition5 = merged_df['bank'] == 'GXS'
condition6 = merged_df['sentiment'] == 'Negative'
combined_condition_3 = condition4 & condition5 & condition6

resolve_issue_3_df = merged_df[~combined_condition_3]
resolve_issue_3_df['recommendation'] = rec_3
#print(resolve_issue_3_df)

banks = resolve_issue_3_df.bank.unique()
bank_nps_list = []

for bank in banks:
  # filter that bank only
  bank_df = resolve_issue_3_df[resolve_issue_3_df['bank'] == bank]
  nps_score = nps(bank_df)
  bank_nps_list.append([bank, nps_score])

whatif_bank_nps_df = pd.DataFrame(bank_nps_list, columns = ["bank", "nps"])
#print(whatif_bank_nps_df)

# CONVERT PANDA TABLES TO JSON

full_json_list = full_df.to_json(date_format='%Y-%m-%d', orient='records')
full_json = loads(full_json_list)
full_json_object = dumps(full_json, indent=4)
with open("../server/data/full.json", "w") as outfile:
    outfile.write(full_json_object)

serv_issue_rec_json_list = serv_issue_rec_df.to_json(orient='records')
serv_issue_rec_json = loads(serv_issue_rec_json_list)
serv_issue_rec_json_object = dumps(serv_issue_rec_json, indent=4)
with open("../server/data/serv_issue_rec.json", "w") as outfile:
    outfile.write(serv_issue_rec_json_object)

bank_nps_json_list = bank_nps_df.to_json(orient='records')
bank_nps_json = loads(bank_nps_json_list)
bank_nps_json_object = dumps(bank_nps_json, indent=4)
with open("../server/data/bank_nps.json", "w") as outfile:
    outfile.write(bank_nps_json_object)

serv_issue_freq_json_list = serv_issue_freq_df.to_json(orient='records')
serv_issue_freq_json = loads(serv_issue_freq_json_list)
serv_issue_freq_json_object = dumps(serv_issue_freq_json, indent=4)
with open("../server/data/serv_issue_freq.json", "w") as outfile:
    outfile.write(serv_issue_freq_json_object)

month_nps_json_list = month_nps_df.to_json(orient='records')
month_nps_json = loads(month_nps_json_list)
month_nps_json_object = dumps(month_nps_json, indent=4)
with open("../server/data/month_nps.json", "w") as outfile:
    outfile.write(month_nps_json_object)

bank_serv_freq_json_list = bank_serv_freq_df.to_json(orient='records')
bank_serv_freq_json = loads(bank_serv_freq_json_list)
bank_serv_freq_json_object = dumps(bank_serv_freq_json, indent=4)
with open("../server/data/bank_serv_freq.json", "w") as outfile:
    outfile.write(bank_serv_freq_json_object)

bank_serv_issue_freq_json_list = bank_serv_issue_freq_df.to_json(orient='records')
bank_serv_issue_freq_json = loads(bank_serv_issue_freq_json_list)
bank_serv_issue_freq_json_object = dumps(bank_serv_issue_freq_json, indent=4)
with open("../server/data/bank_serv_issue_freq.json", "w") as outfile:
    outfile.write(bank_serv_issue_freq_json_object)

whatif_rec_nps_json_list = whatif_rec_nps_df.to_json(orient='records')
whatif_rec_nps_json = loads(whatif_rec_nps_json_list)
whatif_rec_nps_json_object = dumps(whatif_rec_nps_json, indent=4)
with open("../server/data/whatif_rec_nps.json", "w") as outfile:
    outfile.write(whatif_rec_nps_json_object)

whatif_bank_nps_json_list = whatif_bank_nps_df.to_json(orient='records')
whatif_bank_nps_json = loads(whatif_bank_nps_json_list)
whatif_bank_nps_json_object = dumps(whatif_bank_nps_json, indent=4)
with open("../server/data/whatif_bank_nps.json", "w") as outfile:
    outfile.write(whatif_bank_nps_json_object)