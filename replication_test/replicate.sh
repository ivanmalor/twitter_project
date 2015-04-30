#!/bin/sh

#Replicate t1 to t2
curl -H 'Content-Type: application/json' -X POST http://localhost:5984/_replicate -d '{"source":"http://localhost:5984/t1", "target":"http://localhost:5984/t2"}'