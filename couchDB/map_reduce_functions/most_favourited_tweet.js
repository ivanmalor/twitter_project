function(doc) {
	tweet_id = doc.tweet_data.id
	favorite_count = doc.tweet_data.favorite_count
 	emit(tweet_id, favorite_count);
}