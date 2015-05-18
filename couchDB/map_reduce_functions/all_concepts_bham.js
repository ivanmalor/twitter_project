//Map function to get the tally of concepts people are talking about in Birmingham


function(doc) {
    if(doc.tweet_data.coordinates.coordinates ){
        point = doc.tweet_data.coordinates.coordinates;
        
    } else {
        return
    }
    if(inside_box(point)){
        user_name = doc.tweet_data.user.screen_name
        if(doc.meaningcloud){
            if(doc.meaningcloud.concept_list){
                doc.meaningcloud.concept_list.forEach(function(concept){
                //ignore all @username
                    if(concept.text.indexOf("@") < 0){
                        emit([concept.text, user_name],  1);
                    }
                });
            }
        }
    }
}

//function to find whether a spatial coordinate is within a box of coordinates
//Used from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
function inside_box (point) {
    bbox = [[-2.0336485,52.381053],[-2.0336485,52.6087058],[-1.7288577,52.6087058],[-1.7288577,52.381053],[-2.0336485,52.381053]]
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
