function(doc) {
	date = new Date(Date.parse((doc.tweet_data.created_at)));
	weekday = getWeekday(date.getDay())
	hour = date.getUTCHours()
	emit([weekday,hour], 1)
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
