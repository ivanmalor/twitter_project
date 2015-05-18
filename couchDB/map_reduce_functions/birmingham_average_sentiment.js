//Map function to get the average sentiment of all tweets with meaningcloud atrributes
//In Birmingham

function(doc){
    //boundaries of birmingham city
    bham = [[-2.0336485,52.381053],[-2.0336485,52.6087058],[-1.7288577,52.6087058],[-1.7288577,52.381053],[-2.0336485,52.381053]]
    
    //if the tweet is geo-enabled and has the meaningcloud attributes
    if(doc.tweet_data.coordinates.coordinates && doc.meaningcloud.score){
        point = doc.tweet_data.coordinates.coordinates;
        score = doc.meaningcloud.score
    } else {
        return
    }
    tweet = doc.tweet_data.text
    user_name = doc.tweet_data.user.screen_name
    if (point && inside_box(point, bham)){
        //with group level 0 gets the total of tweets and total sentiment
        emit('Birmingham Sentiment', [1, parseFloat(score)]);
    }  
}

//function to find whether a spatial coordinate is within a box of coordinates
//Used from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
function inside_box (point, bbox) {
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
