//Filters the tweets with coordinates from a bounding box

function(doc){
	
  //Copy the bounding box GEOJSON format from http://boundingbox.klokantech.com and delete the outer brackets
    if(doc.tweet_data.coordinates.coordinates){
        point = doc.tweet_data.coordinates.coordinates;
    } else {
        return
    }
    tweet = doc.tweet_data.text
    user_name = doc.tweet_data.user.screen_name
    if (point && inside_box(point)) {
        if (doc.meaningcloud.score){
            emit([user_name, tweet],[1, score])
        }
    };  
}

function inside_box (point) {
    
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    bbox = [[-1.9372565,52.4469876],[-1.9372565,52.4652158],[-1.9189703,52.4652158],[-1.9189703,52.4469876],[-1.9372565,52.4469876]]
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
