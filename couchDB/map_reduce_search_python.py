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

    map_func = open(func_dir + map_name + '.js', 'r').read()

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
        if view_name in 'total_sentiment_by_weekday sentiment_morning_night topic_sentiment birmingham_university_sentiment':
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

def correlate_hourly_ratio(ret, N):
    total_by_day = sort_map_reduce_search(ret, N, 1)
    total_by_hour = sort_map_reduce_search(ret, N, 2)
    dic = {}
    ret = Counter()
    for item in total_by_day:
        day = re.sub("[\[\]\'\s]", '', item[0])
        dic[day] = float(item[1])
    for item in total_by_hour:
        day = re.sub("[\[\]\',0-9\s]", '', item[0])
        ret[item[0]] = item[1]/dic[day]

    for val in (ret.most_common(20)):
        print (val[0], val[1])

    json_data = json.dumps(ret.most_common(10))
    
    #send results to queries db to be displayed in frontend
    save_json(json_data, 'most_frequent_tweet_hour')





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


def perform_topic_sentiment_search(top_n, ret, view_name, reduce_func):
    server = ret["server"]
    db = ret["db"]
    design_name = view_name

    # Uses the Counter dictionary returned by previous top n topic search
    # and embeds it in a javascript function for topic/sentiment search
    topics = []
    for t in top_n:
        # Make it lowercase
        concept = re.sub("[\[\]\']", '', t[0])
        topics.append('"'+ concept.lower() +'"')
    topics_insert = ", ".join(topics)
    fragment = open(os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/topic_sentiment_fragment.js",'r').read()
    map_func_file = open(os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/" + view_name + ".js",'w')
    map_func = """function(doc) {
                    topic_list = """ + "[" + topics_insert + "]" + "\n" + fragment
    # Writes the map function made according to popular hash tag topics into js file
    map_func_file.write(map_func)
    map_func_file.close()

    if reduce_func != '':
        reduce_used = True
    else:
        reduce_used = False

    create_view('http://115.146.93.167:5984/', 'twit', view_name, reduce_func)
    
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
param1 = create_view('http://115.146.93.167:5984/', 'twit', 'most_mentioned_tweeter', '_count')
param2 = create_view('http://115.146.93.167:5984/', 'twit', 'all_concepts', '_count')
param3 = create_view('http://115.146.93.167:5984/', 'twit', 'hash_tag_topics', '_count')
param4 = create_view('http://115.146.93.167:5984/', 'twit', 'total_sentiment_by_weekday', '_sum')
param5 = create_view('http://115.146.93.167:5984/', 'twit', 'sentiment_morning_night', '_sum')
param6 = create_view('http://115.146.93.167:5984/', 'twit', 'user_tweet_language', '_count')
param7 = create_view('http://115.146.93.167:5984/', 'twit', 'most_followers', '')
param8 = create_view('http://115.146.93.167:5984/', 'twit', 'most_prolific_tweeter', '_count')
param10 = create_view('http://115.146.93.167:5984/', 'twit', 'topic_accent', '_count')
param12 = create_view('http://115.146.93.167:5984/', 'twit', 'most_mentioned_avfc_players', '_count')
param13 = create_view('http://115.146.93.167:5984/', 'twit', 'most_positive_sentiment_avfc_player', '_sum')
param14 = create_view('http://115.146.93.167:5984/', 'twit', 'tweet_number_time_day', '_count')
param15 = create_view('http://115.146.93.167:5984/', 'twit', 'jobs', '')
param16 = create_view('http://115.146.93.167:5984/', 'twit', 'birmingham_university_tweets', '')
param17 = create_view('http://115.146.93.167:5984/', 'twit', 'vamps_negative', '')
param18 = create_view('http://115.146.93.167:5984/', 'twit', 'vamps_positive', '')
param19 = create_view('http://115.146.93.167:5984/', 'twit', 'birmingham_university_sentiment', '_sum')
param20 = create_view('http://115.146.93.167:5984/', 'twit', 'birmingham_university_topics', '_count')
param21 = create_view('http://115.146.93.167:5984/', 'twit', 'election_mentions', '_count')
param22 = create_view('http://115.146.93.167:5984/', 'twit', 'election_sentiment', '_sum')



correlate_hourly_ratio(param14, 0)



# Put in N as second argument for top N
# N=0 for all docs, sorted descendingly
try:
    print ("ctrl+c or ctrl+z to abort")
    sort_map_reduce_search(param17, 0, 2)
    sort_map_reduce_search(param18, 0, 2)
    sort_map_reduce_search(param1, 10, 1)
    concept_topics = sort_map_reduce_search(param2, 100, 1)
    hash_tag_topics = sort_map_reduce_search(param3, 10, 1)
    sort_map_reduce_search(param4, 15, 1)
    highest_sentiment_period = sort_map_reduce_search(param5, 21, 1)
    sort_map_reduce_search(param6, 50, 2)
    sort_map_reduce_search(param7, 10, 1)
    sort_map_reduce_search(param8, 10, 1)
    sort_map_reduce_search(param12, 10, 2)
    sort_map_reduce_search(param13, 10, 2)
    sort_map_reduce_search(param14, 0, 2)
    sort_map_reduce_search(param15, 0, 2)
    sort_map_reduce_search(param16, 0, 2)
    sort_map_reduce_search(param20, 0, 2)
    sort_map_reduce_search(param21, 15, 2)



    param_new = perform_topic_sentiment_search(concept_topics, param2, "concept_sentiment", '_sum')
    sort_map_reduce_search(param_new, 10, 1)
    sort_map_reduce_search(param10, 10, 1)

    param11 = perform_day_sentiment_search(highest_sentiment_period, param5)
    sort_map_reduce_search(param11, 10, 2)
    #now: election and university

    param_new = perform_topic_sentiment_search(hash_tag_topics, param3, "hash_tag_sentiment", '_sum')
    sort_map_reduce_search(param_new, 10, 1)

except KeyboardInterrupt:
    print ("Program exiting")















