__author__ = 'Siyuan Zhang'

import couchdb
from collections import Counter

# the number of the most talked topics to be returned
N = 10
if __name__ == "__main__":

    # Connect the server with url http://username:password@server_ip_address:5984/
    couch = couchdb.Server('http://localhost:5984/')

    # Get the database
    db = couch['twit']

    # Map function to query all topics
    # (source from entity list of meaningCloud output)
    map_fun_all_topics = """
        function(doc) {
            if(doc.meaningcloud){
                if(doc.meaningcloud.entity_list){
                    doc.meaningcloud.entity_list.forEach(function(entity){
                    //ignore all @username
                        if(entity.text.indexOf("@")< 0){
                            emit(entity.text, 1);
                        }
                    });
                }
            }
        }
    """

    # Map function to query topics with #hashtag in the front
    # Source from "entities" field in tweet_data
    # By doing this, the complexity can be reduced
    # The function appends a hash symbol to the head of each topic text
    # so that the topic can be in the format of "#sometopic"
    map_fun_hash_tag_topics = """
        function(doc) {
            if(doc.tweet_data.entities){
                if(doc.tweet_data.entities.hashtags){
                    doc.tweet_data.entities.hashtags.forEach(function(hashtag){
                        emit("#"+hashtag.text,1)
                    });
                }
            }
        }
    """

    # Reduce function
    reduce_fun ="_count"

    # Design view
    design = {'views': {'count_occurrence': {
                        # Use map_fun_hash_tag_topics to query topics with hashtags
                        'map': map_fun_all_topics,
                        'reduce': reduce_fun
                        }}
              }

    # Comment out this line to create new design view for counting occurrence of each topic
    if not ("_design/topics" in db):
        db["_design/topics"] = design

    # Get viewresult from couchdb
    results = db.view('topics/count_occurrence', group_level=1)

    # Create a counter object to store the list of topics returned from couchdb
    dict = Counter()
    for row in results:
        dict[row.key] = row.value

    # Print out the top N topics
    hot_topics = dict.most_common(N)
    for t in hot_topics:
        print(t)