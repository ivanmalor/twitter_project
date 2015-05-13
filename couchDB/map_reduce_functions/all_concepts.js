function(doc) {
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