function(doc) {
	topic = '#onstagewiththevamps'
	user_name = doc.tweet_data.user.screen_name
	tweet = doc.tweet_data.text.toLowerCase()

	if (is_mentioned(topic,user_name,tweet)){
		score = doc.meaningcloud.score
		if (score && score < -0.5){
 			emit([user_name, tweet], score);
		}
	}

}

function is_mentioned(topic,user_name,tweet){
	//checks where the word appears in tweet or mentioned
	if (tweet.split(" ").indexOf(topic) > -1){
		return true
	} 
	//if the specific topic word is not mentioned in tweet look for it in hashtag
	else if(doc.tweet_data.entities){
    	if(doc.tweet_data.entities.hashtags){
            doc.tweet_data.entities.hashtags.forEach(function(hashtag){
                if(("#"+hashtag.text).toLowerCase() == topic){
                	return true
                }
            });
        }
    //if still not found look for it in the meaningcloud concept list for the tweet
    } else if (doc.meaningcloud.concept_list){
        doc.meaningcloud.concept_list.forEach(function(concept){
	        if(concept.text.toLowerCase() == topic){
	        	return true
	 		}
		});
	}
    	return false
}
