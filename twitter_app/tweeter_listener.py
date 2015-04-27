from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import time,json,sys

FILE = 'BHAM_DB.csv'
consumer_key = "sEe0b4yXx5uJ54QvtbvfEYPP7"
consumer_secret = "RmHmFvINJOnvxkUNdgMX1UrEyDBQfZobB9yUEx80yUxloKistN"
access_token = "2201707272-Dno4Gb4CHJO9VwaXhOU46bnNA0NRUsMSSozXVTS"
access_token_secret = "ntOU6yld0iOZVE86DKLAqRlcVrqoK2tFyfNWkUFT3AZiU"

# all city
GEOBOX_BHAM = [-2.0336485,52.381053,-1.7288577,52.6087058]
# Quadrants of the city 
GEOBOX_BHAM_1 = [-2.033649,52.381053,-1.887473,52.497652]
GEOBOX_BHAM_2 = [-1.887473,52.380634,-1.728858,52.497652]
GEOBOX_BHAM_3 = [-2.033649,52.494074,-1.887473,52.608706]
GEOBOX_BHAM_4 = [-1.887393,52.490729,-1.728858,52.608706]


class listener(StreamListener):
	
	def on_data(self, data):
		try:
			print (data)
			saveFile = open(FILE,'a')
			saveFile.write(data)
			saveFile.write('\n')
			saveFile.close()
			return True
		except BaseException as e:
			print(e)
			time.sleep(5)

	def on_error(self,status):
		if status_code == 420:
			print(status)
			return False
            #returning False in on_data disconnects the stream
            

auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
twitterStream = Stream(auth,listener())
twitterStream.filter(locations = GEOBOX_BHAM_4)

		