import os
import time,json,sys
import couchdb
from couchdb.mapping import Document, TextField, FloatField



server_location = "http://localhost:5984/"
couch = couchdb.Server(server_location)
couch.delete('t1')
couch.delete('t2')
couch.create('t1')
couch.create('t2')

db = couch['t1']
for i in range (1,76):
	doc = {"_id": str(i), "db": "t1"}
	db.save(doc)
db = couch['t2']
for j in range (25,101):
	doc = {"_id": str(j), "db": "t2"}
	db.save(doc)

couch.replicate("http://localhost:5984/t1", "http://localhost:5984/t2" , continuous=True)

#should be db:"t1" for id 1..75 in t2 after replication
#the source overwrites the same ID documents in destination