//Used to find out which language the user prefer to use when tweeting
//When querying, make sure to use group_level = 3
function(doc) {
  if(doc.tweet_data.user.id == 3127895833){
    emit([doc.tweet_data.user.id, doc.tweet_data.user.screen_name, doc.tweet_data.lang], 1);
  }
}