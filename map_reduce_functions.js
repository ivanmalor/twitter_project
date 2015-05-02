// MapReduce functions to be used in CouchDB for the analysis scenarios


// To find geo-location enabled accounts
function(doc) {

   if (doc.tweet_data.geo) 
   {                
           emit(doc.tweet_data.geo, [doc.tweet_data.text,doc.tweet_data.user.id] );
       
   }
}

// User of the tweet and the language he/she uses in the tweet

function(doc) {

   if (doc.tweet_data) 
   {                
           emit(doc.tweet_data.user.id, [doc.tweet_data.lang, doc.tweet_data.text] );
       
   }
}


// User of the tweet and their geolocation 
function(doc) {

   if (doc.tweet_data.geo) 
   {                
           emit(doc.tweet_data.user.id, [doc.tweet_data.geo] );
       
   }
}