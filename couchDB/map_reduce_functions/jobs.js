function(doc) {
	topics = ['job', 'jobs']
	user_name = doc.tweet_data.user.screen_name
	tweet = doc.tweet_data.text.toLowerCase()

	if (is_mentioned(topics,user_name,tweet)){
		score = doc.meaningcloud.score
		geo_enabled = doc.tweet_data.geo.coordinates
		if (score && geo_enabled){
 			emit([user_name, tweet], [score, geo_enabled]);
		}
	}
}

function is_mentioned(topics,user_name,tweet){
	//checks where the word appears in tweet or mentioned
	if (tweet.split(" ").indexOf(topics) > -1){
		return true
	//look for it in meaningcloud entity list
	} else if (doc.meaningcloud.entity_list){
        doc.meaningcloud.entity_list.forEach(function(entity){
        	topics.forEach(function(t){
		        if(entity.text.toLowerCase() == t){
		        	return true
		 		}
        	});
		});
	}
	//if the specific topics words is not mentioned in tweet look for it in hashtag
	else if(doc.tweet_data.entities){
    	if(doc.tweet_data.entities.hashtags){
            doc.tweet_data.entities.hashtags.forEach(function(hashtag){
            	topics.forEach(function(t){
	                if((hashtag.text).toLowerCase() == t){
	                	return true
	                }
            	});
            });
        }
    //if still not found look for it in the meaningcloud concept list for the tweet
    } else if (doc.meaningcloud.concept_list){
        doc.meaningcloud.concept_list.forEach(function(concept){
        	topics.forEach(function(t){
		        if(concept.text.toLowerCase() == t){
		        	return true
		 		}
        	});
		});
	}
    	return false
}