//Find the sentiment extent of a particular user towards a certain topic
//Use group_level = 3 to get the all sentiment levels towards a topic
function(doc) {
  if(doc.tweet_data.user.id == 3127895833){
    if(doc.meaningcloud){
      if(doc.meaningcloud.entity_list){
        doc.meaningcloud.entity_list.forEach(function(entity){
          if(entity.text == "Straw"){
            if(entity.score_tag){
              emit([doc.tweet_data.user.id, doc.tweet_data.user.screen_name, entity.score_tag], 1)
            }
	  }
        });
      }
    }
  }
}