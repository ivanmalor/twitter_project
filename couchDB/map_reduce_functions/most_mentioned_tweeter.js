function(doc) {
    if(doc.tweet_data.entities){
        if(doc.tweet_data.entities.user_mentions){
            doc.tweet_data.entities.user_mentions.forEach(function(user){
                emit('@'+user.screen_name, 1)
            });
        }
    }
}