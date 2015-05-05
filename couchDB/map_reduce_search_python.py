__author = "Richard Gale"

import couchdb
import os
from collections import Counter

# the number of the most talked topics to be returned

def create_view(server, db, map_name, reduce_name, view_name, design_name):
    # Connect the server with url http://username:password@server_ip_address:5984/
    func_dir = os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/"

    couch = couchdb.Server(server)
    # Get the database
    db = couch[db]

    # Map function to count the times that a tweeter has been @.
    # This only considers the collected tweet data.
    map_func = open(func_dir + map_name, 'r').read()

    # Reduce function
    if reduce_name in "_count _sum _stats":
    	reduce_func = reduce_name
    else:
    	reduce_func = open(func_dir + reduce_name, 'r')

    # Design view
    design = {'views': { view_name: {
                        'map': map_func,
                        'reduce': reduce_func
                        }},
              # 'language': 'python'
              }

    # Comment out this line to create new design view for counting times that a tweeter has been @
    if not (("_design/" + design_name) in db):
        db["_design/" + design_name] = design

    return {"server": server, "db" : db, "view_name" : view_name, "design_name" : design_name}


def do_map_reduce_search(ret, N):
    
    server = ret["server"]
    db = ret["db"]
    view_name = ret["view_name"]
    design_name = ret["design_name"]
    
	# Get viewresult from couchdb
    returned_view = db.view(design_name + "/" + view_name, group_level=1)

    result_dict = Counter()

    if (N != 0):
	    # Create a counter object to store the list of topics returned from couchdb
	    for row in returned_view:
	        result_dict[row.key] = row.value

	    # Print out the top N tweeters
	    top_n = result_dict.most_common(N)
	    for t in top_n:
	        print(t)

	    print ("----------------------------")
    else:
    	for row in returned_view:
    		print ((row.key, row.value))

#arguments in order:
#server address
#database name
#name of map function file in ./map_reduce_functions
#name of reduce function file in ./map_reduce_functions (or default operation)
#view name
#design name 
ret1 = create_view('http://localhost:5984/', 'twit3', 'most_mentioned_tweeter.js', '_count', 'count_retweet_times', 'tweeter')
ret2 = create_view('http://localhost:5984/', 'twit3', 'all_topics.js', '_count', 'count_occurence', 'topics')
ret3 = create_view('http://localhost:5984/', 'twit3', 'total_sentiment_by_weekday.js', '_sum', 'tweet_sentiment', 'tweet_sentiment')

#put in N as second argument for top N
#N=0 for no top N
do_map_reduce_search(ret1, 10)
do_map_reduce_search(ret2, 10)
do_map_reduce_search(ret3, 0)
