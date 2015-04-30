# -*- encoding: utf-8 -*-
"""
 Topics Extraction 1.2 starting client for Python.

 In order to run this example, the license key must be included in the key variable.
 If you don't know your key, check your personal area at MeaningCloud (https://www.meaningcloud.com/developer/account/licenses)

 Once you have the key, edit the parameters and call "python topicsclient-1.2.py"

 You can find more information at http://www.meaningcloud.com/developer/topics-extraction/doc/1.2

 @author     MeaningCloud
 @contact    http://www.meaningcloud.com (http://www.daedalus.es)
 @copyright  Copyright (c) 2015, DAEDALUS S.A. All rights reserved.
"""

import httplib
import urllib
import json


# We define the variables need to call the API
host = 'api.meaningcloud.com'
api = '/topics-1.2.php'
key = 'd2ba90e4acf476b6ae774ac9931ab0c8'
txt =  'Birmingham is a great city but I hate soccer'
lang = 'en' #es/en/fr/it/pt/ca


# Auxiliary function to make a post request
def sendPost():
  params = urllib.urlencode({'key': key,'lang': lang, 'txt': txt, 'tt': 'a', 'src': 'sdk-python-1.2'}) # management internal parameter
  headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}
  conn = httplib.HTTPConnection(host)
  conn.request("POST", api, params, headers)
  response = conn.getresponse()
  return response 


# We make the request and parse the response
response_text = sendPost()
data = response_text.read()
r = json.loads(data)


# Show the response
print "Response"
print "================="
print data
print "\n"


# Prints the specific fields in the response (entities)
print "Entities: "
print "==========="
output = ''

try:
  if len(r['entity_list']) > 0:
    entities = r['entity_list']
    info_type = ''
    for index in range(len(entities)):
      output += '  - ' + entities[index]['form']
      try:
        output += ' (' + entities[index]['sementity']['type'] + ')'
      except KeyError:
        pass
      output += "\n"
  else:
    print "Not found\n"
except KeyError:
  print "Not found\n"

if output != '':
  print output

# Prints the specific fields in the response (concepts)
output = ''
print "Concepts: "
print "==========="

try:
  if len(r['concept_list']) > 0:
    concepts = r['concept_list']
    info_type = ''
    for index in range(len(concepts)):
      output += '  - ' + concepts[index]['form']
      try:
        output += ' (' + concepts[index]['sementity']['type'] + ')'
      except KeyError:
        pass
      output += "\n"
  else:
    print "Not found\n"
except KeyError:
  print "Not found\n"

if output != '':
  print output

# Prints the specific fields in the response (time expressions)
 
output = ''
print "Time expressions: "
print "==================="

try:
  if len(r['time_expression_list']) > 0:
    timeExpressions = r['time_expression_list']
    for index in range(len(timeExpressions)):
      output += '  - ' + timeExpressions[index]['form'] + "\n"
  else:
    print "Not found\n"
except KeyError:
  print "Not found\n"

if output != '':
  print output

# Prints the specific fields in the response (money expressions)
output = ''
print "Money expressions: "
print "==================="

try:
  if len(r['money_expression_list']) > 0:
    moneyExpressions = r['money_expression_list']
    for index in range(len(moneyExpressions)):
      output += '  - ' + moneyExpressions[index]['form'] + "\n"
  else:
    print "Not found\n"
except KeyError:
  print "Not found\n"

if output != '':
  print output


# Prints the specific fields in the response (URIs)
output = ''
print "URIs: "
print "======="

try:
  if len(r['uri_list']) > 0:
    uris = r['uri_list']
    for index in range(len(uris)):
      output += '  - ' + uris[index]['form']
      try:
        output += ' (' + uris[index]['type'] + ')'
      except KeyError:
        pass
      output += "\n"
  else:
    print "Not found\n"
except KeyError:
  print "Not found\n"

if output != '':
  print output


# Prints the specific fields in the response (phone expressions)
output = ''
print "Phone expressions: "
print "==================="

try:
  if len(r['phone_expression_list']) > 0:
    phoneExpressions = r['phone_expression_list']
    for index in range(len(phoneExpressions)):
      output += '  - ' + phoneExpressions[index]['form'] + "\n"
  else:
    print "Not found\n"
except KeyError:
  print "Not found\n"

if output != '':
  print output


# Prints the specific fields in the response (other expressions)
output = ''
print "Other expressions: "
print "==================="

try:
  if len(r['other_expression_list']) > 0:
    otherExpressions = r['other_expression_list']
    for index in range(len(otherExpressions)):
      output += '  - ' + otherExpressions[index]['form'] + "\n"
  else:
    print "Not found\n"
except KeyError:
  print "Not found\n"

if output != '':
  print output

# Prints the specific fields in the response (quotations)
output = ''
print "Quotations: "
print "==============="
try:
  if len(r['quotation_list']) > 0:
    quote = r['quotation_list']
    for index in range(len(quote)):
      output += '  - ' + quote[index]['form'] + "\n"
      try:
        output += '  + who: ' + quote[index]['who']
        try:
          output += ' (' + quote[index]['who_lemma'] + ')'
        except KeyError:
          pass
        output += "\n"
        output += '  + verb: ' + quote[index]['verb']
        try:
          output += ' (' + quote[index]['verb_lemma'] + ')'
        except KeyError:
          pass
        output += "\n"
      except KeyError:
        pass
  else:
    print "Not found\n"
except KeyError:
  print "Not found\n"
if output != '':
  print output


# Prints the specific fields in the response (relations)
output = ''
print "Relations: "
print "================"
try:
  if len(r['relation_list']) > 0: 
    relation = r['relation_list']
    for index in range(len(relation)):
      output += '  - ' + relation[index]['form'] + "\n"
      try:
        output += '   + subject: ' + relation[index]['subject']['form']
        aux = '|'.join(relation[index]['subject']['lemma_list'])
        if aux != '':
          output += ' (' + aux + ')'
        output += "\n"
      except KeyError:
        pass
      try:
        output += '   + verb: ' + relation[index]['verb']['form']
        aux = '|'.join(relation[index]['verb']['lemma_list'])
        if aux != '':
          output += ' (' + aux + ')'
        output += "\n"
      except KeyError:
        pass
      try:
        output += '   + complements: ' + "\n"
        complement = relation[index]['complement_list']
        for j in range(len(complement)):
          output += '     * ' + complement[j]['form'] + "\n"
      except KeyError:
        pass
  else:
    print "Not found\n"
except KeyError:
  print "Not found\n"

if output != '':
  print output
