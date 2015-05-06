function(doc){
	user_name = doc.tweet_data.user.screen_name
	emit(user_name, 1)
}
