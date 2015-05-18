function(doc) {
                    topic_list = ["day", "man", "home", "people", "work", "match", "report", "video", "photograph", "love", "fight", "baby", "exam", "food", "mother", "guy", "family", "boy", "buddy", "child", "rebel", "woman", "world", "position", "canteen", "friend", "car", "place", "train", "final", "father", "bank", "club", "attack", "head", "plug", "season", "cup", "bank holiday", "queen", "school", "bus", "coffee", "service", "money", "fan", "mile", "picture", "arrogant", "today"]
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