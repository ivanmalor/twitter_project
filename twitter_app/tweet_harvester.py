__author__ = 'Richard Gale, Matheu Malo, Kevin Zhang'

"""Adopted/combined Matheu and Kevin's code segments to put 
twitter stream json data directly into couchdb.
You need to:
1)Change the API keys
2)Change Couchdb location + database name
3)Select Birmingham location segment (GEOBOX_BHAM1~4)
For the program to work properly on your machine/node.

Get tweepy and couchdb library using pip
"""

from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import os
import time,json,sys
import couchdb
from couchdb.mapping import Document, TextField, FloatField
from meaningcloud_client import sendPost


#Put in your own keys
# Go to http://apps.twitter.com and create an app.
# The consumer key and secret will be generated for you after
consumer_key = "Qj1fA1PTEVQ3QlzosarbzUJmV"
consumer_secret = "QYQM8RQODJgM7IKjd4OJ45AQEBJCcYjctuN0SAn7778xNNLk25"

# After the step above, you will be redirected to your app's page.
# Create an access token under the the "Your access token" section
access_token = "3215255242-jmsz0Kk8nBtSSYdiXEnimoanwZ0e46ddVMDvsc5"
access_token_secret = "6019n6lBa2nO3kep24uTJajNYfDFmYAIHDEa2M8E1Ch4K"

#this one is using rg_bham account

# Geobox of Birmingham, UK. Source: http://boundingbox.klokantech.com/
GEOBOX_BHAM = [-2.0336485,52.381053,-1.7288577,52.6087058]
# Geobox divided in quadrants. For each VM
GEOBOX_BHAM_1 = [-2.033649,52.381053,-1.887473,52.497652]
GEOBOX_BHAM_2 = [-1.887473,52.380634,-1.728858,52.497652]
GEOBOX_BHAM_3 = [-2.033649,52.494074,-1.887473,52.608706]
GEOBOX_BHAM_4 = [-1.887393,52.490729,-1.728858,52.608706]
#choose the appropriate coordinates for the node

#handles authentication
auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)


#set up couchdb (local version)
#put in your own db name and address
db_name = 'twit2'
server_location = "http://localhost:5984/"
couch = couchdb.Server(server_location)
db = couch[db_name]
duplicate_count = 0



class listener(StreamListener):
	""" A listener handles tweets received from the stream.
	This is a custom listener that store received tweets to FILE.
	"""
	def on_data(self, tweet_data):
		try:
			#converts to json format then saves in couchdb
			tweets_json = json.loads(tweet_data)
			doc_id = tweets_json["id_str"]
			#id of the document is the tweet id
			#get additional attributes from meaningcloud service
			response_text = sendPost(tweets_json["text"])
			data = response_text.read()
			r = json.loads(data.decode())

			doc = {"_id": doc_id, "tweet_data": tweets_json, "meaningcloud": r}

			# We make the request and parse the response
			db.save(doc)
			print('added: ' + doc_id)
			return True
		except BaseException as e:
			print(e)
			time.sleep(5)
		except couchdb.http.ResourceConflict:
			#handles duplicates
			duplicate_count += 1
			time.sleep(5)

	def on_error(self,status):
		#returning False in on_data disconnects the stream
		if status_code == 420:
			print(status)
			return False
			
			
def main():
	print("Streaming started....")
	try:
		twitterStream = Stream(auth,listener())
		twitterStream.filter(locations = GEOBOX_BHAM)
	except Exception as e:
		print("Error or execution finished. Program exiting... ")
		print("there were {0} duplicates".format(duplicate_count))
		twitterStream.disconnect()

main()