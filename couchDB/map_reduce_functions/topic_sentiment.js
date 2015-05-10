function(doc) {
                    topic_list = ["#birmingham", "#starwarsweek", "#england", "#bodymania", "#weareallprincesses", "housing crisis", "wow", "#dudley", "juve", "#westmidlands"] 
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