function(doc) {
    if(doc.meaningcloud){
        if(doc.meaningcloud.entity_list){
            doc.meaningcloud.entity_list.forEach(function(entity){
            //ignore all @username
                if(entity.text.indexOf("@")< 0){
                    emit(entity.text.toLowerCase(), 1);
                }
            });
        }
    }
}