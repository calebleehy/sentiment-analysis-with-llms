import pandas as pd
from backend_utils import get_datapath
"""
Evaluate model by comparing sentiment classification with RoBERTa
"""
DATAPATH = get_datapath()

def main():
    merged_df = pd.read_csv(DATAPATH + './merged.csv')

    # create abbreviated table for sentiment classification only
    merged_abbr_df = merged_df.rename(columns={'sentiment': 'mistral_sentiment'}, inplace=True)
    merged_abbr_df = merged_df[['rowid', 'rating', 'review', 'mistral_sentiment']]


    # RoBERTa model
    from transformers import AutoTokenizer
    from transformers import AutoModelForSequenceClassification
    from scipy.special import softmax
    import numpy as np

    ## use RoBERTa base model to evaluate our mistral model
    MODEL = f"cardiffnlp/twitter-roberta-base-sentiment"
    tokenizer = AutoTokenizer.from_pretrained(MODEL)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL)

    ## asking RoBERTa to give us sentiment classification in same format as Mistral
    def sentiment_classifier_roberta(example):
        encoded_text = tokenizer(example, return_tensors='pt')

        # Pass the encoded text through the model
        output = model(**encoded_text)

        # Get the scores and apply softmax
        scores = output[0][0].detach().numpy()
        scores = np.exp(scores) / np.exp(scores).sum(-1, keepdims=True)

        # Get the index of the highest score
        max_index = np.argmax(scores)

        # Define the sentiment labels
        sentiment_labels = ['Negative', 'Neutral', 'Positive']

        # Get the corresponding sentiment label
        sentiment = sentiment_labels[max_index]

        return sentiment

    merged_abbr_df['roberta_sentiment'] = merged_abbr_df['review'].apply(sentiment_classifier_roberta)

    merged_abbr_df['rating'] = merged_abbr_df['rating'].astype(int)


    # plotting results of both models for comparison
    import seaborn as sns
    import matplotlib.pyplot as plt
    plt.style.use('ggplot')

    ## comparing frequency of each sentiment class for each model

    #define custom colors for each sentiment
    colors = {'Positive': 'green', 'Negative': 'red', 'Neutral': 'grey'}

    #define the order of x-axis ticks
    sentiment_order = ['Positive', 'Neutral', 'Negative']

    #create separate count plots for 'mistral_sentiment' and 'roberta_sentiment'
    fig, axes = plt.subplots(1, 2, figsize=(10, 5))

    #plot for 'roberta_sentiment'
    sns.countplot(x='roberta_sentiment', data=merged_abbr_df, ax=axes[0], palette=colors, order=sentiment_order, hue = 'roberta_sentiment', legend=False)
    axes[0].set_title('Roberta Sentiment')
    axes[0].set_xlabel('Sentiment')
    axes[0].set_ylabel('Count')

    #plot for 'mistral_sentiment'
    sns.countplot(x='mistral_sentiment', data=merged_abbr_df, ax=axes[1], palette=colors, order=sentiment_order, hue='mistral_sentiment', legend=False)
    axes[1].set_title('Mistral Sentiment')
    axes[1].set_xlabel('Sentiment')
    axes[1].set_ylabel('Count')

    #set the same y-axis limits for both plots
    max_count = max(merged_abbr_df['roberta_sentiment'].value_counts().max(),
                    merged_abbr_df['mistral_sentiment'].value_counts().max()
                    )
    axes[0].set_ylim(0, max_count)
    axes[1].set_ylim(0, max_count)

    #save the plots
    plt.savefig(DATAPATH + './evaluation1.png', bbox_inches = 'tight')


    ##comparing sentiment tagging with ratings from the reviews for both models

    #define custom colors for each rating
    colors = {5: 'green', 4: 'limegreen', 3: 'grey', 2: 'orange', 1: 'red'}

    #create subplots for mistral_sentiment and roberta_sentiment
    fig, axes = plt.subplots(1, 2, figsize=(10, 5))

    #plot for roberta_sentiment
    sns.countplot(data=merged_abbr_df, x='roberta_sentiment', hue='rating', order=sentiment_order, ax=axes[0], palette=colors)
    axes[0].set_xlabel('Roberta Sentiment')
    axes[0].set_ylabel('Count')
    axes[0].set_title('Roberta Sentiment')
    axes[0].legend(title='Rating')

    #plot for mistral_sentiment
    sns.countplot(data=merged_abbr_df, x='mistral_sentiment', hue='rating', order=sentiment_order, ax=axes[1], palette=colors)
    axes[1].set_xlabel('Mistral Sentiment')
    axes[1].set_ylabel('Count')
    axes[1].set_title('Mistral Sentiment')
    axes[1].legend(title='Rating')

    #set the same y-axis limits for both plots
    max_count = max(merged_abbr_df['roberta_sentiment'].value_counts().max(),
                    merged_abbr_df['mistral_sentiment'].value_counts().max(),
                    )
    axes[0].set_ylim(0, max_count)
    axes[1].set_ylim(0, max_count)

    #save the plots
    plt.savefig(DATAPATH + './evaluation2.png', bbox_inches = 'tight')


    #singling out some reviews that have been misclassified

    review_no1 = merged_abbr_df.query('(rating == 1) & (roberta_sentiment == "Positive") & (mistral_sentiment == "Negative")')['rowid'].values[0]
    merged_abbr_df.loc[merged_abbr_df['rowid'] == review_no1]

    review_no2 = merged_abbr_df.query('(rating == 1) & (mistral_sentiment == "Positive") & (roberta_sentiment == "Negative")')['rowid'].values[11]
    merged_abbr_df.loc[merged_abbr_df['rowid'] == review_no2]

    review_no3 = merged_abbr_df.query('(rating == 5) & (mistral_sentiment == "Negative") & (roberta_sentiment == "Positive")')['rowid'].values[0]
    merged_abbr_df.loc[merged_abbr_df['rowid'] == review_no3]

if __name__ == '__main__':
    main()
