__author = "Richard Gale"

import couchdb
import os
from collections import Counter
import json

# Create a view in couchDB

def create_view(server, db, map_name, reduce_name, view_name, design_name):
    #the path of the map and reduce functions (relative to this file)
    func_dir = os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/"

    # Connect the server with url http://username:password@server_ip_address:5984/
    couch = couchdb.Server(server)

    if server == "http://115.146.93.167:5984/":
        username = "CCC-2015team17"
        password = "CCC-Team17"
        couch.resource.credentials = (username, password)
    # Get the database
    db = couch[db]

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
    # if not (("_design/" + design_name) in db):
    db["_design/" + design_name] = design

    # Return if reduce function has been used
    reduce_used = reduce_name != ""
    return {"server": couch, "db": db, "view_name": view_name, "design_name": design_name, "reduce_used": reduce_used}

# Load couchDB views and perform sorting on returned views
def sort_map_reduce_search(ret, N, identifier, g_level):
    #gets the settings from dict returned from create_view
    db = ret["db"]
    view_name = ret["view_name"]
    design_name = ret["design_name"]
    view_name = ret["view_name"]
    reduce_used = ret["reduce_used"]

    # Get viewresult from couchdb
    if reduce_used:
        returned_view = db.view(design_name + "/" + view_name, group_level=g_level)
    else:
        returned_view = db.view(design_name + "/" + view_name)

    result_dict = Counter()

    # Identifier is used to differentiate the output explanation according to
    # the key value structure of the search

    if identifier == 'count_user_mention':
        print("The number of mentions of each Twitter user are: ")
    elif identifier == 'count_topic':
        print("The number of mentions of the following topics are: ")
    elif identifier == 'avg_sentiment':
        print("The average sentiment per each time period are: ")
    elif identifier == 'count_lang':
        print("The number of each user/tweet language combinations are: ")
    elif identifier == 'count_follower':
        print("The most followed Twitter users are: ")
    elif identifier == 'count_tweets':
        print("The Twitter users with the most tweets harvested are:")
    elif identifier == 'contains_word':
        print("The tweets which contain the parameter word are: ")
    elif identifier == 'topic_sentiment':
        print("The average sentiment for each of the topics are: ")
    print("----------------------------")

    for row in returned_view:
        if identifier in "avg_sentiment topic_sentiment":
            # For weekday scenarios when you want to get the average sentiment by dividing with total tweets
            result_dict[row.key] = round((float(row.value[1]) / row.value[0]), 5)
        else:
            result_dict[str(row.key)] = row.value

    # Perform top N search, if N == 0 return all rows descendingly
    # create a counter object to store the list of topics returned from couchdb
    if N != 0:
        top_n = result_dict.most_common(N)
    else:
        top_n = result_dict.most_common()
    for t in top_n:
        print(t[0], t[1])
    print("----------------------------")

    # Outputs the sorted dictionary with map reduce results into JSON
    output_json(top_n, view_name)
    return top_n


# Outputs the sorted map reduce search result into a json file
def output_json(top_n, view_name):
    json_data = json.dumps(dict(top_n))

    json_file = open(os.path.dirname(os.path.realpath(__file__)) + "/json_output/" + view_name +".json",'w')
    json_file.write(json_data)


def perform_topic_sentiment_search(top_n, ret):
    server = ret["server"]
    db = ret["db"]
    view_name = "topic_sentiment"
    design_name = "topic_sentiment"

    # Uses the Counter dictionary returned by previous top n topic search
    # and embeds it in a javascript function for topic/sentiment search
    topics = []
    for t in top_n:
        # Make it lowercase
        topics.append('"'+ t[0].lower() +'"')
    topics_insert = ", ".join(topics)
    map_func_file = open(os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/topic_sentiment.js",'w')
    map_func = """function(doc) {
                    topic_list = [""" + topics_insert + """] 
                    tweet = doc.tweet_data.text.toLowerCase()
                    //if there is a sentiment for the tweet
                    if (doc.meaningcloud.score){
                        //creates a list of individual tweet words
                        tweet_words = tweet.split(" ")
                        //checks where the word appears in tweet
                        topic_list.forEach(function(t){
                            //for each topic word compare for each word in tweet
                            var index = tweet_words.indexOf(t)
                            //if topic word is found in list
                            if (index > -1){
                                emit(tweet_words[index], [1, parseFloat(doc.meaningcloud.score)]);
                            }
                        });
                    }
                }"""
    # Writes the map function made according to popular topics into js file
    map_func_file.write(map_func)
    reduce_func = "_sum"
    reduce_used = True

    # Design view
    design = {'views': { view_name: {
                        'map': map_func,
                        'reduce': reduce_func
                        }}
                  }
    # Make new view or not if already exist
    if not (("_design/" + design_name) in db):
        db["_design/" + design_name] = design

    # Return if reduce function has been used
    new_param = {"server": server, "db" : db, "view_name" : view_name, "design_name" : design_name, "reduce_used" : reduce_used}
    return new_param



# Arguments in order:
# Server address
# Database name
# Name of map function file in ./map_reduce_functions
# Name of reduce function file in ./map_reduce_functions (or default operation)
# View name
# Design name

param1 = create_view('http://115.146.93.167:5984/', 'twit', 'most_mentioned_tweeter.js', '_count', 'most_mentioned_tweeter', 'most_mentioned_tweeter')
param2 = create_view('http://115.146.93.167:5984/', 'twit', 'all_topics.js', '_count', 'all_topics', 'all_topics')
param3 = create_view('http://115.146.93.167:5984/', 'twit', 'hash_tag_topics.js', '_count', 'hash_tag_topics', 'hash_tag_topics')
param4 = create_view('http://115.146.93.167:5984/', 'twit', 'total_sentiment_by_weekday.js', '_sum', 'total_sentiment_by_weekday', 'total_sentiment_by_weekday')
param5 = create_view('http://115.146.93.167:5984/', 'twit', 'sentiment_morning_night.js', '_sum', 'sentiment_morning_night', 'sentiment_morning_night')
param6 = create_view('http://115.146.93.167:5984/', 'twit', 'user_tweet_language.js', '_count', 'user_tweet_language', 'user_tweet_language')
param7 = create_view('http://115.146.93.167:5984/', 'twit', 'most_followers.js', '', 'most_followers', 'most_followers')
param8 = create_view('http://115.146.93.167:5984/', 'twit', 'most_prolific_tweeter.js', '_count', 'most_prolific_tweeter', 'most_prolific_tweeter')
param10 = create_view('http://115.146.93.167:5984/', 'twit', 'topic_accent.js', '_count', 'topic_accent', 'topic_accent')


# Put in N as second argument for top N
# N=0 for all docs, sorted descendingly

sort_map_reduce_search(param1, 10, 'count_user_mention', 1)
sort_map_reduce_search(param3, 10, 'count_topic', 1)
sort_map_reduce_search(param4, 15, 'avg_sentiment', 1)
sort_map_reduce_search(param5, 14, 'avg_sentiment', 1)
sort_map_reduce_search(param6, 50, 'count_lang', 2)
sort_map_reduce_search(param7, 10, 'count_follower', 1)
sort_map_reduce_search(param8, 10, 'count_tweets', 1)

top_n = sort_map_reduce_search(param2, 10, 'count_topic', 1)
param9 = perform_topic_sentiment_search(top_n, param2)
sort_map_reduce_search(param9, 10, 'topic_sentiment', 1)

sort_map_reduce_search(param10, 0, 'count_topic', 1)













