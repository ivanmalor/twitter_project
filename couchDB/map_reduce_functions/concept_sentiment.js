function(doc) {
                    topic_list = ["rt", "hypertext transfer protocol", "day", "match", "people", "voting", "candidate", "campaign", "man", "station", "page", "final", "fight", "host", "left", "home", "report", "tomorrow", "work", "woman", "elector", "block", "coalition", "job", "today", "government", "support", "country", "future", "card", "friend", "celebrate", "photograph", "political", "selfie", "idiot", "guy", "change", "event", "family", "hope", "result", "video", "arrogant", "call", "city", "mother", "service", "business", "chance"]
    tweet = doc.tweet_data.text.toLowerCase()
    //if there is a sentiment for the tweet
    if (doc.meaningcloud.score){
        //creates a list of individual tweet words
        tweet_words = tweet.split(" ")
        //checks where the word appears in tweet
        topic_list.forEach(function(t){
            //for each topic word compare for each word in tweet
            var index = tweet_words.indexOf(t)
            //if topic word is found in list
            if (index > -1){
                emit(tweet_words[index], [1, parseFloat(doc.meaningcloud.score)]);
            }
        });
    }
}

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