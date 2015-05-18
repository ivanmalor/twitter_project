//Map function to get tweets mentioning jobs in Birmingham

function(doc) {
	topics = ['job', 'jobs']
	point = doc.tweet_data.coordinates.coordinates;
	user_name = doc.tweet_data.user.screen_name
	if (is_mentioned(topics, doc)){
		if (doc.meaningcloud.score){
			score = doc.meaningcloud.score
			if (point && inside_box(point)){
	 			emit([tweet, point], [1,parseFloat(score)]);
			}
		}
	}
}

function inside_box (point) {
    //Copy the bounding box GEOJSON format from http://boundingbox.klokantech.com and delete the outer brackets
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    //boundaries of Birmingham city
    bbox = [[-2.0336485,52.381053],[-2.0336485,52.6087058],[-1.7288577,52.6087058],[-1.7288577,52.381053],[-2.0336485,52.381053]]
    
    var x = point[0], y = point[1];
    
    var inside = false;
    
    for (var i = 0, j = bbox.length - 1; i < bbox.length; j = i++) {
        var xi = bbox[i][0], yi = bbox[i][1];
        var xj = bbox[j][0], yj = bbox[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

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
	else if (doc.meaningcloud.entity_list){
        doc.meaningcloud.entity_list.forEach(function(entity){
        	topics.forEach(function(t){
		        if(entity.text.toLowerCase() == t){
		        	eval = true
		 		}
        	});
		});
	}
	//if the specific topics words is not mentioned in tweet look for it in hashtag
    //if still not found look for it in the meaningcloud concept list for the tweet
    } else if (doc.meaningcloud.concept_list){
        doc.meaningcloud.concept_list.forEach(function(concept){
        	topics.forEach(function(t){
		        if(concept.text.toLowerCase() == t){
		        	eval = true
		 		}
        	});
		});
	}
    return eval
}