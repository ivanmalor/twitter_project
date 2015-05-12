//Filters the tweets with coordinates from a bounding box

function(doc){
	
  //Copy the bounding box from http://boundingbox.klokantech.com and delete the outer brackets
  bounding_box = [[144.9467131826,-37.8171271513],[144.9467131826,-37.8082777396],[144.9634110095,-37.8082777396],[144.9634110095,-37.8171271513],[144.9467131826,-37.8171271513]]
	point = doc.tweet_data.coordinates.coordinates;
	place_id = doc.tweet_data.place.id
	place_name = doc.tweet_data.place.name
	tweet = doc.tweet_data.text
	if (inside_box(point,bounding_box)) {
		emit([place_name,tweet],point)
	};
	
}

function inside_box (point, bbox) {
    
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
