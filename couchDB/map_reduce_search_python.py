__author = "Richard Gale"

import couchdb
import os
from collections import Counter
import json
import re

# Create a view in couchDB

def create_view(server, db, map_name, reduce_name):
    #the path of the map and reduce functions (relative to this file)
    func_dir = os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/"

    view_name = re.sub('.js', '', map_name)
    design_name = view_name

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
        reduce_func = ''
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
    #whether to make new view or not if already exists and same functions
    same = eval_new_old_funcs(db, design_name, map_func, reduce_func)
    if not same:
        #if the view exists but function/s are different, replace the functions
        if (("_design/" + design_name) in db):
            view = db["_design/" + design_name]
            db.delete(view)
            db["_design/" + design_name] = design
        #if the existing view is not found simply create it
        else:
            db["_design/" + design_name] = design

    # Return if reduce function has been used
    reduce_used = reduce_name != ""
    return {"server": couch, "db": db, "view_name": view_name, "design_name": design_name, "reduce_used": reduce_used}


#evaluates whether the current map/reduce functions in view are identical to the ones being inserted
def eval_new_old_funcs(db, design_name, map_func, reduce_func):
    if (("_design/" + design_name) in db):
        curr_view = db["_design/" + design_name]
    else:
        return False

    view = curr_view.values()
    for item in view:
        if type(item) is dict:
            curr_map = item[design_name]['map']
            try:
                curr_reduce = item[design_name]['reduce']
            except KeyError:
                curr_reduce = ''

            if curr_map != map_func or curr_reduce != reduce_func:
                return False
    return True

# Load couchDB views and perform sorting on returned views
def sort_map_reduce_search(ret, N, g_level):
    #gets the settings from dict returned from create_view
    db = ret["db"]
    view_name = ret["view_name"]
    design_name = ret["design_name"]
    reduce_used = ret["reduce_used"]

    # Get viewresult from couchdb
    if reduce_used:
        returned_view = db.view(design_name + "/" + view_name, group_level=g_level)
    else:
        returned_view = db.view(design_name + "/" + view_name)

    result_dict = Counter()

    # Identifier is used to differentiate the output explanation according to
    # the key value structure of the search

    print(view_name)
    if N != 0:
        print("top {0}:".format(N))
    else:
        print ("all instances: ")
    print("----------------------------")

    for row in returned_view:
        if view_name in 'total_sentiment_by_weekday sentiment_morning_night topic_sentiment':
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
    save_json(top_n, view_name)
    return top_n


# Outputs the sorted map reduce search result into a json file
def save_json(top_n, view_name):
    databaseName = "queries_results"
    server = "http://115.146.93.167:5984/"
    username = "CCC-2015team17"
    password = "CCC-Team17"
    couch = couchdb.Server(server)
    couch.resource.credentials = (username, password)
    # Get the database
    db = couch[databaseName]
    json_data=db.get(view_name)
    if json_data:
       json_data["data"]=top_n
    else:
       json_data= {"_id":view_name,"data":top_n}
    db.save(json_data)


def perform_concept_sentiment_search(top_n, ret):
    server = ret["server"]
    db = ret["db"]
    view_name = "concept_sentiment"
    design_name = "concept_sentiment"

    # Uses the Counter dictionary returned by previous top n topic search
    # and embeds it in a javascript function for topic/sentiment search
    topics = []
    for t in top_n:
        # Make it lowercase
        concept = re.sub("[\[\]\']", '', t[0])
        topics.append('"'+ concept.lower() +'"')
    topics_insert = ", ".join(topics)
    map_func_file = open(os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/concept_sentiment.js",'w')
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

def perform_hashtag_sentiment_search(top_n, ret):
    server = ret["server"]
    db = ret["db"]
    view_name = "hashtag_sentiment"
    design_name = "hashtag_sentiment"

    # Uses the Counter dictionary returned by previous top n topic search
    # and embeds it in a javascript function for topic/sentiment search
    topics = []
    for t in top_n:
        # Make it lowercase
        concept = re.sub("[\[\]\']", '', t[0])
        topics.append('"'+ concept.lower() +'"')
    topics_insert = ", ".join(topics)
    map_func_file = open(os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/hashtag_sentiment.js",'w')
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

def perform_day_sentiment_search(top_n, ret):
    server = ret["server"]
    db = ret["db"]
    view_name = "highest_sentiment_tweets"
    design_name = "highest_sentiment_tweets"

    # Uses the Counter dictionary returned by previous top n topic search
    # and embeds it in a javascript function for topic/sentiment search
    highest_sentiment_period = top_n[0][0]
    map_func_file = open(os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/highest_sentiment_tweets.js",'w')
    fragment_file = open(os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/highest_sentiment_tweets_fragment.js",'r')
    fragment = fragment_file.read()
    map_func = """function(doc) {
    highest_sentiment_period = """ + "'" + highest_sentiment_period + "'" + "\n" + fragment

    # Writes the map function made according to popular topics into js file
    map_func_file.write(map_func)
    reduce_func = "_count"
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
param1 = create_view('http://115.146.93.167:5984/', 'twit', 'most_mentioned_tweeter.js', '_count')
param2 = create_view('http://115.146.93.167:5984/', 'twit', 'all_topics.js', '_count')
param3 = create_view('http://115.146.93.167:5984/', 'twit', 'hash_tag_topics.js', '_count')
param4 = create_view('http://115.146.93.167:5984/', 'twit', 'total_sentiment_by_weekday.js', '_sum')
param5 = create_view('http://115.146.93.167:5984/', 'twit', 'sentiment_morning_night.js', '_sum')
param6 = create_view('http://115.146.93.167:5984/', 'twit', 'user_tweet_language.js', '_count')
param7 = create_view('http://115.146.93.167:5984/', 'twit', 'most_followers.js', '')
param8 = create_view('http://115.146.93.167:5984/', 'twit', 'most_prolific_tweeter.js', '_count')
param10 = create_view('http://115.146.93.167:5984/', 'twit', 'topic_accent.js', '_count')
param12 = create_view('http://115.146.93.167:5984/', 'twit', 'most_mentioned_avfc_players.js', '_count')
param13 = create_view('http://115.146.93.167:5984/', 'twit', 'most_positive_sentiment_avfc_player.js', '_sum')
param14 = create_view('http://115.146.93.167:5984/', 'twit', 'tweet_number_time_day.js', '_count')
param15 = create_view('http://115.146.93.167:5984/', 'twit', 'jobs.js', '')




# Put in N as second argument for top N
# N=0 for all docs, sorted descendingly

sort_map_reduce_search(param1, 10, 1)
all_topics = sort_map_reduce_search(param2, 100, 1)
sort_map_reduce_search(param3, 10, 1)
sort_map_reduce_search(param4, 15, 1)
highest_sentiment_period = sort_map_reduce_search(param5, 14, 1)
sort_map_reduce_search(param6, 50, 2)
sort_map_reduce_search(param7, 10, 1)
sort_map_reduce_search(param8, 10, 1)
sort_map_reduce_search(param12, 10, 2)
sort_map_reduce_search(param13, 10, 2)
sort_map_reduce_search(param14, 0, 2)
sort_map_reduce_search(param15, 0, 2)


param9 = perform_concept_sentiment_search(all_topics, param2)
sort_map_reduce_search(param9, 10, 1)

sort_map_reduce_search(param10, 10, 1)

param11 = perform_day_sentiment_search(highest_sentiment_period, param5)
sort_map_reduce_search(param11, 10, 2)
















