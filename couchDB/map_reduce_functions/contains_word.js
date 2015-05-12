function(doc) {
	topic = 'accent'
	user_name = doc.tweet_data.user.screen_name
	tweet = doc.tweet_data.text.toLowerCase()
	//checks where the word appears in tweet or mentioned
	if (tweet.split(" ").indexOf(topic) > -1){
 		emit([user_name, doc._id], tweet);
	} 
	//if the specific topic word is not mentioned look for it in meaningcloud
	else if (doc.meaningcloud.concept_list){
        doc.meaningcloud.concept_list.forEach(function(concept){
	        if(concept.text.toLowerCase() == topic){
	 			emit([user_name, doc._id], tweet);
	 		}
		});
	}
}