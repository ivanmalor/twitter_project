function(doc) {
	word = 'the'
	tweet = doc.tweet_data.text
	//if there is a sentiment for the tweet
	if (doc.meaningcloud.score){
		//checks where the word appears in tweet
		if (tweet.split(" ").indexOf(word) > -1){
	 		emit(word, parseFloat(doc.meaningcloud.score));
		}
	}
}