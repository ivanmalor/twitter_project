function(doc) {
    if(doc.tweet_data.entities){
        if(doc.tweet_data.entities.hashtags){
            doc.tweet_data.entities.hashtags.forEach(function(hashtag){
                emit("#"+hashtag.text,1)
            });
        }
    }
}