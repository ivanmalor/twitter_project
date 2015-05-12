function(doc) {
                    topic_list = ["rt", "hypertext transfer protocol", "day", "match", "man", "people", "fight", "voting", "campaign", "candidate", "final", "page", "home", "left", "block", "report", "host", "woman", "job", "tomorrow", "work", "celebrate", "coalition", "support", "guy", "government", "event", "elector", "mother", "rally", "station", "manager", "friend", "photograph", "dream", "video", "service", "idiot", "fan", "political", "family", "call", "school", "business", "sex", "telephone", "love", "opening", "child", "city", "front", "coach", "country", "place", "district", "hope", "position", "teacher", "future", "fair", "world", "today", "money", "council", "economy", "arrogant", "car", "exam", "result", "boy", "letter", "student", "train", "selfie", "politician", "meeting", "food", "jew", "baby", "policy", "change", "season", "bank", "rain", "club", "chance", "expert", "society", "dog", "member", "muslim", "supporter", "staffie", "person", "record", "poster", "contractor", "card", "blog", "player"] 
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