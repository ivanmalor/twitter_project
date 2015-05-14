function(doc) {
	topics = ['accent']
	user_name = doc.tweet_data.user.screen_name
	if (is_mentioned(topics, doc)){
 		emit(user_name, tweet);
	}
}

function is_mentioned(topics, doc){
	//checks where the word appears in tweet or mentioned
	eval = false
	tweet = doc.tweet_data.text.toLowerCase()
	tweet_words = tweet.split(" ")
	topics.forEach(function(t){
		if (tweet_words.indexOf(t) > -1){
			eval = true
		}
	});
	//look for it in meaningcloud entity list
	if(doc.tweet_data.entities){
    	if(doc.tweet_data.entities.hashtags){
            doc.tweet_data.entities.hashtags.forEach(function(hashtag){
            	topics.forEach(function(t){
	                if((hashtag.text).toLowerCase() == t){
	                	eval = true
	                }
            	});
            });
        }
    }
    return eval
}