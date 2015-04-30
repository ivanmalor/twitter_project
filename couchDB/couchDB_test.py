__author__ = 'Siyuan Zhang'

import couchdb
from couchdb.mapping import Document, TextField, FloatField


class Product(Document):
    name = TextField()
    type = TextField()
    price = FloatField()

def add(couchdb, doc):
    doc_id, doc_rev = couchdb.save(doc)
    return doc_id, doc_rev

def getDoc(couchdb, doc_id):
    return couchdb[doc_id]

def getValue(doc, key):
    return doc[key]

def map(doc):
    yield doc['_id'], doc['price']

def reduce(keys, values):
    return sum(values)

if __name__ == "__main__":

    # Connect the server with url http://username:password@server_ip_address:5984/
    couch = couchdb.Server('http://siyuan:zsy91067@localhost:5984/')

    # Get the database
    db = couch['tweets']

    # # doc_id, doc_rev = add(db, {'name': 'stationary', 'type': 'product', 'price': 10.99})
    # # Make a new product instance
    # product = Product(name='test', price=2.5, type='product')
    #
    # # Add the instance to couchDB
    # # equals to db.save(product)
    # doc = product.store(db)
    # print(doc)
    #
    # # Iterate each document in couchDB
    # for doc_id in db:
    #     product = Product.load(db, doc_id)
    #     # doc = getDoc(db, doc_id)
    #     # name = doc['name']
    #     print(product)

    # Map function
    map_fun = """
                function(doc) {
                    if(doc.text.indexOf('the')!== -1){
                        emit(doc._id, doc.text);
                    }
                }
              """

    # Reduce function
    reduce_fun ="_count"

    # Design view
    design = {'views': {'count_occurrence': {
                        'map': map_fun,
                        'reduce': reduce_fun
                        }},
              # 'language': 'python'
              }

    # db["_design/test"] = design

    results = db.view('test/count_occurrence')
    for row in results:
        print(row.value)