function(doc){
	tweet_id = doc.tweet_data.id_str
	user_name = doc.tweet_data.user.screen_name
	followers = doc.tweet_data.user.followers_count
	geo_enabled = doc.tweet_data.geo.coordinates
	if (geo_enabled){
		point = doc.tweet_data.coordinates.coordinates;
		// place_id = doc.tweet_data.place.id
		// place_name = doc.tweet_data.place.name
		inside = inside_bham(point)
		if (inside){
			emit('@'+user_name, followers)
		}
	}
}

function inside_bham (point) {
  	bham_bound = [[-2.0336485,52.381053],[-2.0336485,52.6087058],[-1.7288577,52.6087058],[-1.7288577,52.381053],[-2.0336485,52.381053]]
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    
    for (var i = 0, j = bham_bound.length - 1; i < bham_bound.length; j = i++) {
        var xi = bham_bound[i][0], yi = bham_bound[i][1];
        var xj = bham_bound[j][0], yj = bham_bound[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};
