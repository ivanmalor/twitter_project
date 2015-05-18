//Map function to find mentions of political parties 
//From tweets with #ge2015 #ge15 hash tag
//According to 3 time periods

//Use _sum as reduce function.
//group_level = 2 for the number of mentions on different period of each party
//group_level = 1 for the number of mentions on each party
//group_level = 0 for the total number of mentions of the general election

/* Conservative Party */
var cons_party = ['david','cameron','conservative', '#conservative', ];
/* Labour Party */
var lab_party = ['ed','miliband','labour', '#labour'];
/* Liberal Democrat Party*/
var lib_party = ['nick', 'clegg','liberal', '#liberal', '#libdems'];
/* Scottish National Party*/
var snp = ['nicola', 'sturgeon', 'snp', '#snp', '#votesnp'];
/* UK Independence Party */
var ukip = ['ukip', 'nigel', 'farage', '#ukip'];
/* Greens */
var green = ['green', 'greens', 'farage', '#green', '#greens', 'natalie', 'bennett'];

/* pre-election date - May 7th, 2015 */
// Any tweets before this date are classified as pre-election tweets
pre_ele_date = new Date(2015, 4, 7)

/* post-election date - May 8th, 2015 */
// Any tweets after this date are classified as post-election tweets
post_ele_date = new Date(2015, 4, 8)

function(doc) {

    if(doc.tweet_data.entities.hashtags){
        doc.tweet_data.entities.hashtags.forEach(
        function(hashtag){
            topic = hashtag.text.toLowerCase();
            if(topic == "ge2015" || topic == "ge15"){
                tweet_words = doc.tweet_data.text.toLowerCase().split(" ");

                tweet_words.forEach(
                function(word){
                    var party = getParty(word);
                    if(party!=null){
                        date_obj = new Date(Date.parse((doc.tweet_data.created_at)));
                        var period = getPeriod(date_obj);
                        emit([party, period], 1);
                    }

                });

            }
        });
    }
}

function getParty(word){
   if(cons_party.indexOf(word) > -1){
       return "conservative";
   }else if(lab_party.indexOf(word) > -1){
       return "labour";
   }else if(lib_party.indexOf(word) > -1){
       return "liberal";
   }else if(snp.indexOf(word) > -1){
       return "snp";
   }else if(ukip.indexOf(word) > -1){
       return "ukip";
   }else if(green.indexOf(word) > -1){
       return "green";
   }else{
       return null;
   }
}

function getPeriod(date){
    if(date < pre_ele_date){
        //pre-election
        return "pre-election"
    }else if(date > post_ele_date){
        //post-election
        return "post-election"
    }else{
        //in-election
        return "In-election"
    }
}