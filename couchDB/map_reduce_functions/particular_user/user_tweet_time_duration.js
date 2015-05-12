//Get hour and date of each tweet from a particular user
//Use _sum as reduce function
//Use group_level = 2 to get the number of tweets for different hours on different days
//Use group_level = 1 to get the number of tweets for different days
//Use group_level = 0 to get the total number of tweets for this user

function(doc) {
//Search for tweets of Birmingham Airport
    if(doc.tweet_data.user.id == 52184891){
        date_obj = new Date(Date.parse((doc.tweet_data.created_at)));
        hour = date_obj.getUTCHours().toString();
        key = date_obj.toLocaleDateString();
        emit([key,hour], 1);
    }
}