function(doc) {
	word = 'football'
	user_name = doc.tweet_data.user.screen_name
	followers = doc.tweet_data.user.followers_count
	tweet = doc.tweet_data.text
	//checks where the word appears in tweet
	if (tweet.split(" ").indexOf(word) > -1){
 		emit({user: user_name, tweet: doc._id}, tweet);
	}
}