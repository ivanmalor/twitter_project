function(doc) {
                    topic_list = ["day", "man", "home", "people", "work", "match", "report", "video", "photograph", "exam", "baby", "love", "food", "fight", "mother", "guy", "boy", "family", "buddy", "child", "position", "friend", "rebel", "place", "world", "woman", "canteen", "car", "train", "arrogant", "club", "bank", "father", "final", "plug", "head", "attack", "cup", "season", "bank holiday", "coffee", "rt", "bus", "queen", "service", "school", "fan", "fair", "event", "mile"]
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

//Fragment of concept sentiment or hash tag sentiment functions
//To do further search on the top mentioned topics and find the average
//Sentiment for those topics