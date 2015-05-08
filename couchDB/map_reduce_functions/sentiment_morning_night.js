function(doc) {
	date = new Date(Date.parse((doc.tweet_data.created_at)));
	weekday = getWeekday(date.getDay())
	hour = date.getUTCHours()
	if(doc.meaningcloud.score){
		if (hour >= 7 && hour <= 12)
 			emit(weekday + ' Morning', [1, parseFloat(doc.meaningcloud.score)]);
 		else if (hour >= 18 && hour <= 23)
 			emit(weekday + ' Night', [1, parseFloat(doc.meaningcloud.score)]);
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

