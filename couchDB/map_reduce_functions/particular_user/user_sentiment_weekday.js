//Get the sentiment of a particular user for each weekday
//When querying with group_level = 2, it will return the overall sentiment of the user
//When querying with group_level = 2, it will return the sentiment for each weekday

function(doc) {
  if(doc.tweet_data.user.id == 3127895833){
    date = new Date(Date.parse((doc.tweet_data.created_at)));
    weekday = getWeekday(date.getDay());
    if(doc.meaningcloud.score){
      emit([doc.tweet_data.user.id, doc.tweet_data.user.screen_name, weekday], parseFloat(doc.meaningcloud.score));
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