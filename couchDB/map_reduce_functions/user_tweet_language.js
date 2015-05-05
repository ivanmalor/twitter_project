function(doc) {
	tweet_lang = doc.tweet_data.lang
	user_lang = doc.tweet_data.user.lang
 	emit({"user": user_lang, "tweet": tweet_lang,}, 1);
}