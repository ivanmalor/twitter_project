__author = "Richard Gale"

import couchdb
import os
from collections import Counter

# the number of the most talked topics to be returned

def create_view(server, db, map_name, reduce_name, view_name, design_name):
    #the path of the map and reduce functions (relative to this file)
    func_dir = os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/"

    # Connect the server with url http://username:password@server_ip_address:5984/
    couch = couchdb.Server(server)

    if server == ("http://115.146.93.167:5984/"):
        username = "CCC-2015team17"
        password = "CCC-Team17"
        couch.resource.credentials = (username, password)
    # Get the database
    db = couch[db]


    # Map function to count the times that a tweeter has been @.
    # This only considers the collected tweet data.
    map_func = open(func_dir + map_name, 'r').read()

    # Reduce function

    if reduce_name == '':
        # Design view
        design = {'views': { view_name: {
                        'map': map_func
                        }}
                  }

    else:
        if reduce_name in "_count _sum _stats":
            reduce_func = reduce_name
        else:
            reduce_func = open(func_dir + reduce_name, 'r')

        # Design view
        design = {'views': { view_name: {
                            'map': map_func,
                            'reduce': reduce_func
                            }}
                  }
    # Make new view or not if already exist
    if not (("_design/" + design_name) in db):
        db["_design/" + design_name] = design

    #return if reduce function has been used
    reduce_used = reduce_name != ""
    return {"server": server, "db" : db, "view_name" : view_name, "design_name" : design_name, "reduce_used" : reduce_used}


def do_map_reduce_search(ret, N, identifier):
    #gets the settings from dict returned from create_view
    server = ret["server"]
    db = ret["db"]
    view_name = ret["view_name"]
    design_name = ret["design_name"]
    reduce_used = ret["reduce_used"]
    # Get viewresult from couchdb

    if reduce_used:
        returned_view = db.view(design_name + "/" + view_name, group_level=1)
    else:
        returned_view = db.view(design_name + "/" + view_name)

    result_dict = Counter()

    #identifier is used to differentiate the output explanation according to 
    #the key value structure of the search


    if (identifier == 'count_user_mention'):
        print ("The number of mentions of each Twitter user are: ")
    elif (identifier == 'count_topic'):
        print ("The number of mentions of each topic are: ")
    elif (identifier == 'avg_sentiment'):
        print ("The average sentiment per each time period are: ")
    elif (identifier == 'count_lang'):
        print ("The number of each user/tweet language combinations are: ")
    elif (identifier == 'count_follower'):
        print ("The most followed Twitter users are: ")
    elif (identifier == 'count_tweets'):
        print ("The Twitter users with the most tweets harvested are:")
    elif (identifier == 'contains_word'):
        print ("The tweets which contain the parameter word are: ")
    elif (identifier == 'topic_sentiment'):
        print ("The average sentiment for the tweets containing the parameter word are: ")
    print ("----------------------------")

    for row in returned_view:
        if type(row.key) == dict:
            #for scenarios where the key is a dict with multiple values
            result_dict[('user: ' + row.key['user'], 'tweet: ' + row.key['tweet'])] = row.value
        elif type(row.value) == list:
            #for weekday scenarios when you want to get the average sentiment by dividing with total tweets
            result_dict[(row.key)] = round((float(row.value[1]) / row.value[0]), 5)
        else:
            result_dict[(row.key)] = row.value
    #perform top N search, if N == 0 return all rows descendingly
    #create a counter object to store the list of topics returned from couchdb
    if (N != 0):
        top_n = result_dict.most_common(N)
    else:
        top_n = result_dict.most_common()
    for t in top_n:
        print(t[0], t[1])
    print ("----------------------------")

#arguments in order:
#server address
#database name
#name of map function file in ./map_reduce_functions
#name of reduce function file in ./map_reduce_functions (or default operation)
#view name
#design name 

ret1 = create_view('http://localhost:5984/', 'twit3', 'most_mentioned_tweeter.js', '_count', 'most_mentioned_tweeter', 'most_mentioned_tweeter')
ret2 = create_view('http://localhost:5984/', 'twit3', 'all_topics.js', '_count', 'all_topics', 'all_topics')
ret25 = create_view('http://localhost:5984/', 'twit3', 'hash_tag_topics.js', '_count', 'hash_tag_topics', 'hash_tag_topics')
ret3 = create_view('http://localhost:5984/', 'twit3', 'total_sentiment_by_weekday.js', '_sum', 'total_sentiment_by_weekday', 'total_sentiment_by_weekday')
ret4 = create_view('http://localhost:5984/', 'twit3', 'sentiment_morning_night.js', '_sum', 'sentiment_morning_night', 'sentiment_morning_night')
ret6 = create_view('http://localhost:5984/', 'twit3', 'user_tweet_language.js', '_count', 'user_tweet_language', 'user_tweet_language')
ret7 = create_view('http://localhost:5984/', 'twit3', 'most_followers.js', '', 'most_followers', 'most_followers')
ret8 = create_view('http://localhost:5984/', 'twit3', 'most_prolific_tweeter.js', '_count', 'most_prolific_tweeter', 'most_prolific_tweeter')
ret9 = create_view('http://localhost:5984/', 'twit3', 'contains_word.js', '', 'contains_word', 'contains_word')
ret13 = create_view('http://localhost:5984/', 'twit3', 'topic_and_sentiment.js', '_sum', 'topic_and_sentiment', 'topic_and_sentiment')



#put in N as second argument for top N
#N=0 for all docs, sorted descendingly

do_map_reduce_search(ret1, 10, 'count_user_mention')
do_map_reduce_search(ret2, 10, 'count_topic')
do_map_reduce_search(ret25, 10, 'count_topic')
do_map_reduce_search(ret3, 0, 'avg_sentiment')
do_map_reduce_search(ret4, 14, 'avg_sentiment')
do_map_reduce_search(ret6, 10, 'count_lang')
do_map_reduce_search(ret7, 10, 'count_follower')
do_map_reduce_search(ret8, 10, 'count_tweets')
do_map_reduce_search(ret9, 10, 'contains_word')
do_map_reduce_search(ret13, 10, 'topic_sentiment')









