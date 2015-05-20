import couchdb_processor as couchdb

#Python program to create read and update views in couchDB
#Created by COMP90024 CCC Project 2 Team 17, Semester 1 2015

# Arguments in order:
# Server address
# Database name
# Name of map function file in ./map_reduce_functions
# Name of reduce function file in ./map_reduce_functions (or default couchDB reduce
#Operation of _count, _sum, _stat)
#A blank string for no reduce operation
param1 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'most_mentioned_tweeter', '_count')
param2 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'all_concepts_bham', '_count')
param3 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'hash_tag_topics', '_count')
param4 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'total_sentiment_by_weekday', '_sum')
param5 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'sentiment_morning_night', '_sum')
param6 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'user_tweet_language', '_count')
param7 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'most_followers', '')
param8 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'most_prolific_tweeter', '_count')
param10 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'topic_accent', '')
param12 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'most_mentioned_avfc_players', '_count')
param13 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'most_positive_sentiment_avfc_player', '_sum')
param14 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'tweet_number_time_day', '_count')
param15 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'jobs', '_sum')
param16 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'university_tweets', '')
param17 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'vamps_sentiment', '_sum')
param18 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'vamps_most_positive', '')
param19 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'university_average_sentiment', '_sum')
param20 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'university_topics', '_sum')
param21 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'election_mentions', '_count')
param22 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'election_sentiment', '_sum')
param23 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'accent_sentiment', '_sum')
param24 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'university_jobs', '')
param25 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'university_beverage_other', '')
param26 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'birmingham_average_sentiment', '_sum')
param27 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'university_jobs_tally', '_sum')
param28 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'bham_coordinate_sentiment', '')
param29 = couchdb.create_view('http://115.146.93.167:5984/', 'twit', 'vamps_most_negative', '')

try:
    #Put in N as second argument for top N
    #N=0 for all docs, sorted descendingly
    #Third argument is the group level, 1 as default
    #Fourth argument is the mode, special forms of aggregation done in python
    #Currently 'avg' is supported for average calculation of value[1] / value[0]
    #And 'avg_retain' and 'total' 
    print ("ctrl+c or ctrl+z to abort")
    couchdb.correlate_hourly_ratio(param14, 0)
    concept_topics = couchdb.sort_map_reduce_search(param2, 50, 1)
    hash_tag_topics = couchdb.sort_map_reduce_search(param3, 20, 1)

    couchdb.sort_map_reduce_search(param1, 10, 1)
    couchdb.sort_map_reduce_search(param4, 15, 1, 'avg')
    couchdb.sort_map_reduce_search(param6, 0, 1)
    couchdb.sort_map_reduce_search(param7, 10, 1)
    couchdb.sort_map_reduce_search(param8, 10, 1)
    couchdb.sort_map_reduce_search(param12, 10, 2)
    couchdb.sort_map_reduce_search(param13, 0, 2, 'total')
    couchdb.sort_map_reduce_search(param14, 0, 2)
    couchdb.sort_map_reduce_search(param15, 0, 0, 'avg')
    couchdb.sort_map_reduce_search(param19, 0, 1, 'avg')
    couchdb.sort_map_reduce_search(param20, 50, 2, 'avg_retain')
    couchdb.sort_map_reduce_search(param17, 0, 1, 'avg')
    couchdb.sort_map_reduce_search(param21, 15, 2)
    couchdb.sort_map_reduce_search(param22, 0, 2, 'total')
    couchdb.sort_map_reduce_search(param23, 0, 1, 'avg')
    couchdb.sort_map_reduce_search(param26, 0, 1, 'avg')
    couchdb.sort_map_reduce_search(param27, 0, 1)
    couchdb.sort_map_reduce_search(param28, 0, 1)
    couchdb.sort_map_reduce_search(param29, 0, 1)

    # ones which emits the tweets for random extraction
    couchdb.sort_map_reduce_search(param10, 0, 2)
    couchdb.sort_map_reduce_search(param16, 0, 2)
    couchdb.sort_map_reduce_search(param18, 0, 2)
    couchdb.sort_map_reduce_search(param24, 0, 2)
    couchdb.sort_map_reduce_search(param25, 0, 2)
    # views which depend on the results of other views, such as sentiment on most mentioned topics
    highest_sentiment_period = couchdb.sort_map_reduce_search(param5, 21, 1, 'avg')
    param11 = couchdb.perform_highest_sentiment_search(highest_sentiment_period, param5)
    couchdb.sort_map_reduce_search(param11, 0, 2)

    param_new = couchdb.perform_topic_sentiment_search(concept_topics, param2, "concept_sentiment_bham", '_sum')
    couchdb.sort_map_reduce_search(param_new, 50, 1, 'avg')

    param_new = couchdb.perform_topic_sentiment_search(hash_tag_topics, param3, "hash_tag_sentiment", '_sum')
    couchdb.sort_map_reduce_search(param_new, 10, 1, 'avg')

    #New views fomr here
except KeyboardInterrupt:
    print ("Program exiting")


