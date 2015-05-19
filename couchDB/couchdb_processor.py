__author__ = "Richard Gale, Siyuan Zhang"
__name__ = 'couchdb_processor'

import couchdb
import os
from collections import Counter
import json
import re

#This Python program handles the couchDB MapReduce processing
#Through the couchdb library interface. It handles the creation and modification of views,
#As well as using the views to perform sorting on the values and perform further aggregation
#Similar to the style seen with rereduce.
#Created by CCC Project 2 Team, Semester 1 2015

# Create a view in couchDB, returning a dictionary with the properties of the view
def create_view(server, db, map_name, reduce_name):
    #The path of the map and reduce functions (relative to this file)
    func_dir = os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/"

    view_name = re.sub('.js', '', map_name)
    design_name = view_name

    #Connect the server with url http://username:password@server_ip_address:5984/
    couch = couchdb.Server(server)

    #Authentication specific for this project team
    if server == "http://115.146.93.167:5984/":
        username = "CCC-2015team17"
        password = "CCC-Team17"
        couch.resource.credentials = (username, password)
    # Get the database
    db = couch[db]

    #Reads the Map function from the directory
    map_func = open(func_dir + map_name + '.js', 'r').read()


    #Reduce function is set
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
            reduce_func = open(func_dir + reduce_name, 'r').read()
        # Design view
        design = {'views': { view_name: {
                            'map': map_func,
                            'reduce': reduce_func
                            }}
                  }
    #Checks whether to make new view or not by checking if the functions are identical
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


#Evaluates whether the current map/reduce functions in view are identical to the ones being inserted
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

#Load couchDB views and perform sorting on returned views using Counter objects
#Prints the results in stdout
def sort_map_reduce_search(ret, N, g_level, mode=None):
    #Gets the parameters from dict returned from create_view
    db = ret["db"]
    view_name = ret["view_name"]
    design_name = ret["design_name"]
    reduce_used = ret["reduce_used"]

    # Get view result from couchdb
    if reduce_used:
        returned_view = db.view(design_name + "/" + view_name, group_level=g_level)
    else:
        returned_view = db.view(design_name + "/" + view_name)

    #Counter used to store the views sorted by value
    result_dict = Counter()

    #Prints view name and group level for better readability
    print(view_name)
    if N != 0:
        print("top {0}:".format(N))
    else:
        print ("all instances: ")
    print ("group level: " + str(g_level))
    print("----------------------------")

    for row in returned_view:
        #Regex to remove unnecessary list format for readability
        key = str(re.sub("[\[\'\]]", '', str(row.key)))
        if mode == 'avg':
            #Further processing for scenarios where you want to get the average sentiment 
            #By dividing total sentiment with total number of tweets 
            #Similar to rereduce function 
            result_dict[key] = round((float(row.value[1]) / row.value[0]), 5)
        elif mode == 'avg_retain':
            #Used for university_topics, when you want to retain the total
            #Sentimetn and total number of tweets
            val = list(row.value)
            val.append(round((float(val[1]) / val[0]), 5))
            result_dict[key] = val
        else:
            result_dict[key] = row.value

    #Perform top N search on values descendingly, if N == 0 return all rows
    if N != 0:
        top_n = result_dict.most_common(N)
    else:
        top_n = result_dict.most_common()
    for t in top_n:
        print(t[0], t[1])
    print("----------------------------")

    #Outputs the view results in a sorted dictionary counter into JSON document
    save_json(top_n, view_name)
    return top_n

#Outputs the sorted map reduce search result into a JSON file
#Then posts to the database for display in frontend
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


########################################################

#Specialised function for finding the hour with the highest ratio of tweets
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

    print ("most_frequent_tweet_hour")
    print("----------------------------")
    result = []
    for item in (ret.most_common(15)):
        key = re.sub("[\[\]\'\s]", '', item[0])
        value = str(round(float(item[1])*100,3)) + '%'
        print (key, value)
        result.append((key,value))
    print("----------------------------")
    json_data = json.dumps(result)
    
    #Send results to queries db to be displayed in frontend
    save_json(json_data, 'most_frequent_tweet_hour')


#Specialised function to do a sentiment search based on the top n topics found
#Creates a new JS Map function on the fly by concatenating the retrieved top topics
#list with a JS file fragment to create a new JS function.
def perform_topic_sentiment_search(top_n, ret, view_name, reduce_func):
    server = ret["server"]
    db = ret["db"]
    design_name = view_name

    #Uses the Counter dictionary returned by previous top n topic search
    #And embeds it in a javascript function for further topic/sentiment search
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
    # Writes the map function made according to popular topics into js file
    map_func_file.write(map_func)
    map_func_file.close()

    if reduce_func != '':
        reduce_used = True
    else:
        reduce_used = False

    #Creates a new view from the new Map function
    create_view('http://115.146.93.167:5984/', 'twit', view_name, reduce_func)
    
    new_param = {"server": server, "db" : db, "view_name" : view_name, "design_name" : design_name, "reduce_used" : reduce_used}
    return new_param

#Similarly uses a JS file fragment to find the tweets
#In the time period with the highest average sentiments
def perform_highest_sentiment_search(top_n, ret):
    server = ret["server"]
    db = ret["db"]
    view_name = "highest_sentiment_tweets"
    design_name = "highest_sentiment_tweets"

    # Uses the Counter dictionary returned by previous highest average sentiment period search
    #And embeds it in a javascript function for highest sentiment tweet search
    highest_sentiment_period = top_n[0][0]
    map_func_file = open(os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/" + view_name + ".js",'w')
    fragment_file = open(os.path.dirname(os.path.realpath(__file__)) + "/map_reduce_functions/" + view_name + "_fragment.js",'r')
    fragment = fragment_file.read()
    map_func = """function(doc) {
    highest_sentiment_period = """ + "'" + highest_sentiment_period + "'" + "\n" + fragment

    # Writes the map function made for highest sentiment tweet search
    map_func_file.write(map_func)
    map_func_file.close()
    reduce_func = ''
    reduce_used = False

    #Creates the new view
    create_view('http://115.146.93.167:5984/', 'twit', view_name, reduce_func)

    new_param = {"server": server, "db" : db, "view_name" : view_name, "design_name" : design_name, "reduce_used" : reduce_used}
    return new_param













