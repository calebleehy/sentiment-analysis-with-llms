import pandas as pd
import numpy as np
from google_play_scraper import app, Sort, reviews_all
import json, os, uuid
from app_store_scraper import AppStore
from datetime import datetime
from backend_utils import get_datapath
def main():
    gxs_g_review = reviews_all( 'sg.com.gxs.app', sleep_milliseconds=0, lang='en', country= 'SG', sort=Sort.NEWEST)
    df = pd.json_normalize(gxs_g_review)
    df['bank']='GXS'
    trust_g_review = reviews_all( 'sg.trust', sleep_milliseconds=0, lang='en', country= 'SG', sort=Sort.NEWEST)
    df2 = pd.json_normalize(trust_g_review)
    df2['bank']='Trust'
    mari_g_review = reviews_all( 'sg.com.maribankmobile.digitalbank', sleep_milliseconds=0, lang='en', country= 'SG', sort=Sort.NEWEST)
    df3 = pd.json_normalize(mari_g_review)
    df3['bank']='MariBank'

    all_banks_2 = [df, df2, df3]
    full_data_google = pd.concat(all_banks_2)
    full_data_google['client'] = 'Android'
    full_data_google1 = full_data_google.drop(['reviewId', 'userName', 'userImage', 'thumbsUpCount', 'reviewCreatedVersion', 'repliedAt', 'appVersion'], axis = 1)
    full_data_google1.rename(columns = {'content':'review', 'score':'rating', 'at':'date', 'replyContent':'developer_response'}, inplace = True)
    final_data_google = full_data_google1[['date', 'client', 'bank', 'rating', 'review', 'developer_response']]

    gxs = AppStore(country = 'sg', app_name = 'gxs-bank', app_id = '1632183616')

    gxs.review()  # fetched 132 reviews

    gxsreviews_df = pd.DataFrame(np.array(gxs.reviews), columns = ['review'])
    gxsreviews_df2 = gxsreviews_df.join(pd.DataFrame(gxsreviews_df.pop('review').tolist()))
    gxsreviews_df2['bank'] = 'GXS'
    trust = AppStore(country = 'sg', app_name = 'trust-bank-sg', app_id = '1598460384')

    trust.review() # fetched 543 reviews

    trustreviews_df = pd.DataFrame(np.array(trust.reviews), columns = ['review'])
    trustreviews_df2 = trustreviews_df.join(pd.DataFrame(trustreviews_df.pop('review').tolist()))
    trustreviews_df2['bank'] = 'Trust'
    mari = AppStore(country = 'sg', app_name = 'maribank', app_id = '1658919834')

    mari.review() # fetched 21 reviews

    marireviews_df = pd.DataFrame(np.array(mari.reviews), columns = ['review'])
    marireviews_df2 = marireviews_df.join(pd.DataFrame(marireviews_df.pop('review').tolist()))
    marireviews_df2['bank'] = 'MariBank'

    all_banks = [gxsreviews_df2, trustreviews_df2, marireviews_df2]
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