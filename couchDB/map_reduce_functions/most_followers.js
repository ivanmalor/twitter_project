function(doc){
	tweet_id = doc.tweet_data.id_str
	user_name = doc.tweet_data.user.screen_name
	followers = doc.tweet_data.user.followers_count
	emit(user_name, followers)
}