//Get the sentiment of the user towards a certain topic
//Use group_level = 2 to get the overall sentiment score
//Use group_level = 3 to get the sentiment score for each document about the topic
function(doc) {
  if(doc.tweet_data.user.id == 3127895833){
    if(doc.meaningcloud){
      if(doc.meaningcloud.entity_list){
        doc.meaningcloud.entity_list.forEach(function(entity){
          if(entity.text == "Straw"){
            if(entity.score){
              emit([doc.tweet_data.user.id, doc.tweet_data.user.screen_name, doc._id], parseFloat(entity.score))
            }
	  }
        });
      }
    }
  }
}