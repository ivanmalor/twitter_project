# -*- encoding: utf-8 -*-
"""
 Sentiment Analysis 1.2 starting client for Python.

 In order to run this example, the license key must be included in the key variable.
 If you don't know your key, check your personal area at MeaningCloud (https://www.meaningcloud.com/developer/account/licenses)

 Once you have the key, edit the parameters and call "python sentimentclient-1.2.py"

 You can find more information at http://www.meaningcloud.com/developer/sentiment-analysis/doc/1.2

 @author     MeaningCloud
 @contact    http://www.meaningcloud.com (http://www.daedalus.es)
 @copyright  Copyright (c) 2015, DAEDALUS S.A. All rights reserved.

 Subsequently edited by COMP90024 Cluster and Cloud Computing Team
"""


import http.client
import urllib.parse
import json

# We define the variables need to call the API
host = 'api.meaningcloud.com'
api = '/sentiment-1.2.php'
key = 'd2ba90e4acf476b6ae774ac9931ab0c8'
model = 'en-general' #// es-general/en-general/fr-general


# Auxiliary function to make a post request
def sendPost(text):
    params = urllib.parse.urlencode({"key": key,"model": model, "txt": text, "src": "sdk-python-1.2"})
    headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}
    conn = http.client.HTTPConnection(host)
    conn.request("POST", api, params, headers)
    response = conn.getresponse()
    return response 
