from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import os
import time,json,sys


FILE = 'BHAM_DB.csv'

# Go to http://apps.twitter.com and create an app.
# The consumer key and secret will be generated for you after
consumer_key = "sEe0b4yXx5uJ54QvtbvfEYPP7"
consumer_secret = "RmHmFvINJOnvxkUNdgMX1UrEyDBQfZobB9yUEx80yUxloKistN"

# After the step above, you will be redirected to your app's page.
# Create an access token under the the "Your access token" section
access_token = "2201707272-Dno4Gb4CHJO9VwaXhOU46bnNA0NRUsMSSozXVTS"
access_token_secret = "ntOU6yld0iOZVE86DKLAqRlcVrqoK2tFyfNWkUFT3AZiU"

# Geobox of Birmingham, UK. Source: http://boundingbox.klokantech.com/
GEOBOX_BHAM = [-2.0336485,52.381053,-1.7288577,52.6087058]
# Geobox divided in quadrants. For each VM
GEOBOX_BHAM_1 = [-2.033649,52.381053,-1.887473,52.497652]
GEOBOX_BHAM_2 = [-1.887473,52.380634,-1.728858,52.497652]
GEOBOX_BHAM_3 = [-2.033649,52.494074,-1.887473,52.608706]
GEOBOX_BHAM_4 = [-1.887393,52.490729,-1.728858,52.608706]


class listener(StreamListener):
	""" A listener handles tweets received from the stream.
    This is a custom listener that store received tweets to FILE.
    """
	def on_data(self, data):
		try:
			print (data)
			saveFile = open(FILE,'a')
			saveFile.write(data)
			saveFile.write(os.linesep)
			saveFile.close()
			return True
		except BaseException as e:
			print(e)
			time.sleep(5)

	def on_error(self,status):
		#returning False in on_data disconnects the stream
		if status_code == 420:
			print(status)
			return False
            
            

auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

print("Streaming started....")

try:
	twitterStream = Stream(auth,listener())
	twitterStream.filter(locations = GEOBOX_BHAM)
except Exception as e:
	raise e
	twitterStream.disconnect()


		
