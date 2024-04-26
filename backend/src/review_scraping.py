import pandas as pd
import numpy as np
from google_play_scraper import app, Sort, reviews_all
import json, os, uuid
from app_store_scraper import AppStore
from datetime import datetime
from backend_utils import get_datapath
"""
START HERE
scrapes all App Store, Play store reviews for:
- GXS,
- Trust
- Maribank
though later we decided to drop Maribank due to low sample size
writes to ~/backend/data/final_data.csv
Next: generation/sentiment.py
"""
def main():
    # scraping from google play store
    gxs_g_review = reviews_all( 'sg.com.gxs.app', sleep_milliseconds=0, lang='en', country= 'SG', sort=Sort.NEWEST)
    df = pd.json_normalize(gxs_g_review)
    df['bank']='GXS'
    trust_g_review = reviews_all( 'sg.trust', sleep_milliseconds=0, lang='en', country= 'SG', sort=Sort.NEWEST)
    df2 = pd.json_normalize(trust_g_review)
    df2['bank']='Trust'

    all_banks_2 = [df, df2]
    full_data_google = pd.concat(all_banks_2)
    full_data_google['client'] = 'Android'
    full_data_google1 = full_data_google.drop(['reviewId', 'userName', 'userImage', 'thumbsUpCount', 'reviewCreatedVersion', 'repliedAt', 'appVersion'], axis = 1)
    full_data_google1.rename(columns = {'content':'review', 'score':'rating', 'at':'date', 'replyContent':'developer_response'}, inplace = True)
    final_data_google = full_data_google1[['date', 'client', 'bank', 'rating', 'review', 'developer_response']]


    # scraping from apple app store
    gxs = AppStore(country = 'sg', app_name = 'gxs-bank', app_id = '1632183616')

    gxs.review()
    gxsreviews_df = pd.DataFrame(np.array(gxs.reviews), columns = ['review'])
    gxsreviews_df2 = gxsreviews_df.join(pd.DataFrame(gxsreviews_df.pop('review').tolist()))
    gxsreviews_df2['bank'] = 'GXS'
    trust = AppStore(country = 'sg', app_name = 'trust-bank-sg', app_id = '1598460384')

    trust.review()
    trustreviews_df = pd.DataFrame(np.array(trust.reviews), columns = ['review'])
    trustreviews_df2 = trustreviews_df.join(pd.DataFrame(trustreviews_df.pop('review').tolist()))
    trustreviews_df2['bank'] = 'Trust'
    mari = AppStore(country = 'sg', app_name = 'maribank', app_id = '1658919834')

    all_banks = [gxsreviews_df2, trustreviews_df2]
    full_data_apple = pd.concat(all_banks)
    full_data_apple['client'] = 'Apple'
    full_data_apple1 = full_data_apple.drop(['isEdited', 'userName', 'title'], axis = 1)
    full_data_apple1.rename(columns = {'developerResponse':'developer_response'}, inplace = True)
    final_data_apple = full_data_apple1[['date', 'client', 'bank', 'rating', 'review', 'developer_response']]

    all_clients = [final_data_apple, final_data_google]
    final_data = pd.concat(all_clients)
    final_data.to_csv(get_datapath() + '\\final_data.csv', index_label="rowid")

if __name__=="__main__":
    main()