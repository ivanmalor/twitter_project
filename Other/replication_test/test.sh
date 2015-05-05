#!/bin/sh
curl -X PUT "http://localhost:5984/t1"
curl -X PUT "http://localhost:5984/t2"

curl -X POST "http://localhost:5984/t1" --header "Content-Type:application/json" --data '{"_id": "1"zzz}'
curl -X POST "http://localhost:5984/t1" --header "Content-Type:application/json" --data '{"_id": "2", "name": "see"}'
curl -X POST "http://localhost:5984/t1" --header "Content-Type:application/json" --data '{"_id": "4", "name": "if"}'

curl -X POST "http://localhost:5984/t2" --header "Content-Type:application/json" --data '{"_id": "1", "name": "this"}'
curl -X POST "http://localhost:5984/t2" --header "Content-Type:application/json" --data '{"_id": "2", "name": "thing"}'
curl -X POST "http://localhost:5984/t2" --header "Content-Type:application/json" --data '{"_id": "3", "name": "works"}'
#replicate t1 -> t2, 'this thing works if' on t2
