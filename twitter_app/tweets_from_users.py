__author__ = 'Richard Gale, Matheu Malo, Kevin Zhang'

"""tweets_from_users.py stores tweets of specific users
on couchdb using Twitter's API
"""

import tweepy
from tweepy import OAuthHandler
import json
import time
import couchdb
from couchdb.mapping import Document, TextField, FloatField

# HERE -- LIST OF SCREEN_USERS
SCREEN_USER = "Cholopic"
#twitter's app credentials
c_key = "sEe0b4yXx5uJ54QvtbvfEYPP7"
c_secret = "RmHmFvINJOnvxkUNdgMX1UrEyDBQfZobB9yUEx80yUxloKistN"
a_token = "2201707272-Dno4Gb4CHJO9VwaXhOU46bnNA0NRUsMSSozXVTS"
a_token_secret = "ntOU6yld0iOZVE86DKLAqRlcVrqoK2tFyfNWkUFT3AZiU"


# create a new Oauth api 
def oauth(consumer_key,consumer_secret,token,token_secret):
	auth = OAuthHandler(consumer_key,consumer_secret)
	auth.set_access_token(token,token_secret)
	api = tweepy.API(auth)
	return api

def save_on_file(data,aFile):
	saveFile = open(aFile,'a')
	saveFile.write(data)
	saveFile.write('\n')
	saveFile.close()

def get_tweets(screen_name,api):
	
	# make initial request for most recent tweets
	# (200 is the maximum allowed by count)
	status_list = api.user_timeline(screen_name, count = 200)
		
	for status in status_list:
		raw_status = json.dumps(status._json)
		json_status = json.loads(raw_status)
		doc_id = json_status["id_str"]
		tweet_lang = json_status["lang"]

		# Sentiment analysis def here

		doc = {"_id": doc_id, "tweet_data": json_status}

		store_on_db(doc)
	return

def get_list_timeline(owner_screen_name,slug,api):
	# Show tweet timeline for members of the specified list
	status_list = api.list_timeline(owner_screen_name,slug,count = 180)
	for status in status_list:
		raw_status = json.dumps(status._json)
		json_status = json.loads(raw_status)
		doc_id = json_status["id_str"]
		tweet_lang = json_status["lang"]

		# Sentiment analysis def here

		doc = {"_id": doc_id, "tweet_data": json_status}

		store_on_db(doc)
	return

def store_on_db(doc):
	try:
		#Database info here
		db_name = 'tweets'
		couch = couchdb.Server()
		#db = db_ini(db_name,couch)
		db = couch[db_name]
		db.save(doc)
		print('added: ')
		return
	except couchdb.http.ResourceConflict:
		print("repeated tweet")

def main():
	try:
		api = oauth(c_key, c_secret, a_token, a_token_secret)
		print("download of tweets started.... Ctrl+C to abort")
		#get_tweets(USER_SCREEN,api)
		get_list_timeline(SCREEN_USER,'bham',api)
	except Exception as e:
		print (e)
		print("Error or execution finished. Program exiting... ")
		time.sleep(60)

main()


