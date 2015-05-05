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

    # Map function to count the times that a tweeter has been @.
    # This only considers the collected tweet data.
    map_fun_users = """
        function(doc) {
            if(doc.tweet_data.entities){
                if(doc.tweet_data.entities.user_mentions){
                    doc.tweet_data.entities.user_mentions.forEach(function(user){
                        emit(user.name, 1)
                    });
                }
            }
        }
    """

    # Reduce function
    reduce_fun ="_count"

    # Design view
    design = {'views': {'count_retweet_times': {
                        'map': map_fun_users,
                        'reduce': reduce_fun
                        }},
              # 'language': 'python'
              }

    # Comment out this line to create new design view for counting times that a tweeter has been @
    if not ("_design/tweeter" in db):
        db["_design/tweeter"] = design

    # Get viewresult from couchdb
    tweeter_results = db.view('tweeter/count_retweet_times', group_level=1)

    tweeter_dict = Counter()

    # Create a counter object to store the list of topics returned from couchdb
    for row in tweeter_results:
        tweeter_dict[row.key] = row.value

    # Print out the top N tweeters
    hot_tweeters = tweeter_dict.most_common(N)
    for t in hot_tweeters:
        print(t)