//List all topics the user has talked about
//Querying with group_level = 3 to get count for each topic
function(doc) {
  if(doc.tweet_data.user.id == 3127895833){
    if(doc.meaningcloud){
        if(doc.meaningcloud.entity_list){
            doc.meaningcloud.entity_list.forEach(function(entity){
            //ignore all @username
                if(entity.text.indexOf("@")< 0){
                    emit([doc.tweet_data.user.id, doc.tweet_data.user.screen_name, entity.text.toLowerCase()], 1);
                }
            });
        }
     }
  }
}