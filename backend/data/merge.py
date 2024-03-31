import csv, os
import pandas as pd

# def fix_csv(input_file, output_file):
    # with open(input_file, 'r', newline='') as infile, \
            # open(output_file, 'w', newline='') as outfile:
        # reader = csv.reader(infile)
        # writer = csv.writer(outfile)
        # for row in reader:
            # if len(row) > 1:
                # if not (row[1].startswith('"') and row[1].endswith('"')):
                    # row[1] = f"\"{row[1]}\""# Enclose text after first comma in double quotes
            # writer.writerow(row)
# fix_csv('./rec_from_sent_serv_intent', './data/ssi.csv')
here = os.path.dirname(os.path.abspath(__file__))
filename = os.path.join(here)
print(filename)
sentiment = pd.read_csv('./data/sentiment.csv')
service = pd.read_csv('./data/service.csv')
intent = pd.read_csv('./data/intent.csv')
ssi = pd.read_csv('./rec_from_sent_serv_intent.csv').iloc[:, [0, -1]]
ssi = ssi.rename(columns={"Recommendation.1":"Recommendation"})

final_left = pd.merge(sentiment, service, on='Review Number')
final_right = pd.merge(ssi, intent, on='Review Number')
final_final = pd.merge(final_left, final_right, on='Review Number')
print(final_final.head())
final_final.to_csv('./data/merged.csv', index=False, quoting=csv.QUOTE_NONNUMERIC, quotechar='"')


merged = pd.read_csv("./data/merged.csv")
print(merged.iloc[:5])