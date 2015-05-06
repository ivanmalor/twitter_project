function(doc) {
	user_id = doc.tweet_data.user.id_str
	retweet_count = doc.tweet_data.retweet_count
 	emit(user_id, retweet_count);
}