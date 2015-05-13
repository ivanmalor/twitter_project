//Get the sentiment of a particular user on different time duration
//Use _sum as reduce function
//Use group_level = 4 to get the sentiment for different hours
//Use group_level = 3 to get the sentiment for different dates
//Use group_level = 2 to get the sentiment for different months
//Use group_level = 1 to get the sentiment for different years
//Use group_level = 0 to get the overall sentiment of tweets for this user

function(doc) {
//Search for tweets of Birmingham Airport
    if(doc.tweet_data.user.id == 52184891 && doc.meaningcloud.score){
        date_obj = new Date(Date.parse((doc.tweet_data.created_at)));
        hour = date_obj.getUTCHours().toString();
        year = date_obj.getUTCFullYear().toString();
        //getUTCMonth() returns value from 0 to 11
        month = (date_obj.getUTCMonth()+1).toString();
        date = date_obj.getUTCDate().toString();
        emit([year, month, date, hour], parseFloat(doc.meaningcloud.score));

    }
}