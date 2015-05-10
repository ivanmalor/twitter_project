//Get all tweets from a particular user
function(doc) {
  //Use user.id to filter tweets
  if(doc.tweet_data.user.id == 440417493){
    emit([doc.tweet_data.user.id, doc.tweet_data.user.screen_name], doc.tweet_data.text);
  }
}