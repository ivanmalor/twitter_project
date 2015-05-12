//Use _sum as reduce function.
//group_level = 2 for the sentiment on each player
//group_level = 1 for the sentiment on each position (e.g. striker, goalkeeper)
//group_level = 0 for the overall sentiment for Aston Villa team
aston_villa_squad= ['guzan','steer','given','baker','vlaar','okore','clark','bacuna','senderos','richardson','hutton','cissokho',
'kinsella','lowton','sylla', 'cleverly','sinclair','cole','westwood','delph','herd','sanchez','gil','calder',
'weimann','agbonlahor','benteke','kozak','zogbia','grealish','sherwood'];

/* Goal keepers */
var avfc_gk = ['guzan','steer','given'];
/* Defenders */
var avfc_df = ['baker','vlaar','okore','clark','bacuna','senderos','richardson','hutton','cissokho','kinsella','lowton'];
/* Midfielders*/
var avfc_mf= ['sylla', 'cleverly','sinclair','cole','westwood','delph','herd','sanchez','gil','calder'];
/*Striker*/
var avfc_st=['weimann','agbonlahor','benteke','kozak','zogbia','grealish'];
/*Couch*/
var avfc_co=['sherwood'];

function(doc) {
  if(doc.tweet_data.entities.hashtags){
      doc.tweet_data.entities.hashtags.forEach(
      function(hashtag){
          if(hashtag.text.toLowerCase() === "avfc"){
              aston_villa_squad.forEach(
              function(player){
                  tweet_words = doc.tweet_data.text.toLowerCase().split(" ");
                  if(tweet_words.indexOf(player)>-1){
                      if(doc.meaningcloud.score){
                          var position = getPosition(player);
                          if(position != null){
                              emit([position, player], parseFloat(doc.meaningcloud.score));
                          }
                      }
                  }
              });
          }
      });
  }
}

function getPosition(name){
   if(avfc_gk.indexOf(name) > -1){
       return "GoalKeeper";
   }else if(avfc_df.indexOf(name) > -1){
       return "defender";
   }else if(avfc_mf.indexOf(name) > -1){
       return "Middlefielder";
   }else if(avfc_st.indexOf(name) > -1){
       return "Striker";
   }else if(avfc_co.indexOf(name) > -1){
       return "Coach";
   }else{
       return null;
   }
}