aston_villa_squad= ['guzan','steer','given','baker','vlaar','okore','clark','bacuna','senderos','richardson','hutton','cissokho',
'kinsella','lowton','sylla', 'cleverly','sinclair','cole','westwood','delph','herd','sanchez','gil','calder',
'weimann','agbonlahor','benteke','kozak','zogbia','grealish','sherwood'];

function(doc) {
 if(doc.tweet_data.entities.hashtags){
    doc.tweet_data.entities.hashtags.forEach(
    function(hashtag){
        if(hashtag.text === "avfc"){
            aston_villa_squad.forEach(
                function(player){
                    tweet_words = doc.tweet_data.text.toLowerCase().split(" ");
                    if(tweet_words.indexOf(player)>-1){
                        emit(player, 1);
                    }
                }
            );

        }
    }

 );

 }
}