function(doc) {
    highest_sentiment_period = 'Tuesday Morning'
 	date = new Date(Date.parse((doc.tweet_data.created_at)));
	weekday = getWeekday(date.getDay())
	hour = date.getUTCHours()
	if (hour >= 7 && hour <= 12){
		period = ' Morning'
	} 
	else if (hour > 13 && hour <= 17)
		period = ' Afternoon'
	else if (hour >= 18 && hour <= 23)
		period = ' Night'
	else {
		return
	}
	if (weekday + period == highest_sentiment_period){
		if(doc.meaningcloud.score){
			if (parseFloat(doc.meaningcloud.score) > 0.7){
				user_name = doc.tweet_data.user.screen_name
				tweet_id = doc._id
	 			emit([user_name, tweet_id], doc.tweet_data.text);
			}
	 	}
	}
}

function getWeekday(day){
	switch(parseInt(day)){
		case 0:
			return 'Sunday'
		case 1:
			return 'Monday'
		case 2:
			return 'Tuesday'
		case 3:
			return 'Wednesday'
		case 4:
			return 'Thursday'
		case 5:
			return 'Friday'
		case 6:
			return 'Saturday'
		default:
			return "UNDEFINED"
	}
}

//Fragment for the highest sentiment tweet, where python processing is used to
//Create a new map function on the fly with the highest average sentiment period