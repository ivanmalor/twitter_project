//Filters the tweets with coordinates from a bounding box

function(doc){
    //boundaries of birmingham university
    b_uni = [[-1.9594866483,52.4400293691],[-1.9594866483,52.4652158],[-1.9045507443,52.4652158],[-1.9045507443,52.4400293691],[-1.9594866483,52.4400293691]]
    city_uni = [[-1.9194554351,52.5060403603],[-1.9194554351,52.5298722002],[-1.8671720125,52.5298722002],[-1.8671720125,52.5060403603],[-1.9194554351,52.5060403603]]
    aston_uni = [[-1.8984172551,52.4813043783],[-1.8984172551,52.491873318],[-1.8792522439,52.491873318],[-1.8792522439,52.4813043783],[-1.8984172551,52.4813043783]]
    newman_uni = [[-2.0048162694,52.4301038196],[-2.0048162694,52.4397827356],[-1.9851635915,52.4397827356],[-1.9851635915,52.4301038196],[-2.0048162694,52.4301038196]]
    uni_college = [[-1.9098046662,52.4779600883],[-1.9098046662,52.4847429142],[-1.8977114073,52.4847429142],[-1.8977114073,52.4779600883],[-1.9098046662,52.4779600883]]
    
    if(doc.tweet_data.coordinates.coordinates && doc.meaningcloud.score){
        point = doc.tweet_data.coordinates.coordinates;
        score = doc.meaningcloud.score
    } else {
        return
    }
    tweet = doc.tweet_data.text
    user_name = doc.tweet_data.user.screen_name
    tweet_id = doc._id
    if (point && (inside_box(point, b_uni) || inside_box(point, city_uni) || inside_box(point, aston_uni) || inside_box(point, newman_uni) || inside_box(point, uni_college) ) ) {
        emit([user_name, tweet_id], tweet)
    }  
}

function inside_box (point, bbox) {
    //Copy the bounding box GEOJSON format from http://boundingbox.klokantech.com and delete the outer brackets
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
