//Get the sentiment of a particular user on different time duration
//Use _sum as reduce function
//Use group_level = 2 to get the sentiment for different hours on different days
//Use group_level = 1 to get the sentiment for different days
//Use group_level = 0 to get the overall sentiment for this user

function(doc) {
//Search for tweets of Birmingham Airport
    if(doc.tweet_data.user.id == 52184891){
        date_obj = new Date(Date.parse((doc.tweet_data.created_at)));
        hour = date_obj.getUTCHours().toString();
        key = date_obj.toLocaleDateString();
        if(doc.meaningcloud.score){
 		    emit([key,hour], parseFloat(doc.meaningcloud.score));
 	    }
    }
}