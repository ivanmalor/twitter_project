//Map function to find the Twitter users in Birmingham
//With the most followers

function(doc){
	tweet_id = doc.tweet_data.id_str
	user_name = doc.tweet_data.user.screen_name
	followers = doc.tweet_data.user.followers_count
	geo_enabled = doc.tweet_data.coordinates.coordinates
	if (geo_enabled){
		point = doc.tweet_data.coordinates.coordinates;
		inside = inside_bham(point)
		if (inside){
			emit('@'+user_name, followers)
		}
	}
}

function inside_bham (point) {
	//boundary of birmingham
  	bbox = [[-2.0336485,52.381053],[-2.0336485,52.6087058],[-1.7288577,52.6087058],[-1.7288577,52.381053],[-2.0336485,52.381053]]
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    
    for (var i = 0, j = bbox.length - 1; i < bbox.length; j = i++) {
        var xi = bbox[i][0], yi = bbox[i][1];
        var xj = bbox[j][0], yj = bbox[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};
