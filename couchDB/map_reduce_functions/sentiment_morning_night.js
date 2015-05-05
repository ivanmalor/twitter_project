function(doc) {
	date = new Date(Date.parse((doc.tweet_data.created_at)));
	weekday = getWeekday(date.getDay())
	hour = date.getHours()

	if(doc.meaningcloud.score){
		if (hour >= 7 && hour <= 12)
 			emit(weekday + ' morning', parseFloat(doc.meaningcloud.score));
 		else if (hour >= 18 && hour <= 23)
 			emit(weekday + ' night', parseFloat(doc.meaningcloud.score));
 	}
}

function getWeekday(day){
	switch(parseInt(day)){
		case 0:
			return 'sunday'
		case 1:
			return 'monday'
		case 2:
			return 'tuesday'
		case 3:
			return 'wednesday'
		case 4:
			return 'thursday'
		case 5:
			return 'friday'
		case 6:
			return 'saturday'
		default:
			return "UNDEFINED"
	}
}