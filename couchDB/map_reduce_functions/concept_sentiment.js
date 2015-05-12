function(doc) {
                    topic_list = ["rt", "hypertext transfer protocol", "day", "match", "man", "people", "campaign", "candidate", "fight", "voting", "final", "home", "page", "report", "left", "block", "host", "tomorrow", "woman", "work", "job", "coalition", "celebrate", "support", "elector", "government", "friend", "station", "guy", "event", "idiot", "rally", "mother", "selfie", "photograph", "video", "manager", "dream", "political", "family", "service", "call", "country", "fan", "business", "school", "future", "telephone", "sex", "front", "child", "hope", "love", "city", "coach", "opening", "fair", "district", "place", "position", "arrogant", "economy", "world", "council", "result", "teacher", "today", "change", "money", "politician", "policy", "student", "jew", "exam", "specialist", "boy", "car", "letter", "chance", "supporter", "food", "card", "team", "train", "meeting", "society", "member", "baby", "club", "bank", "season", "rain", "muslim", "expert", "dog", "media", "person", "poster", "tax", "record"] 
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