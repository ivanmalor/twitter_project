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
    couch = couchdb.Server('http://siyuan:zsy91067@localhost:5984/')
    db = couch['mycouchshop']
    # doc_id, doc_rev = add(db, {'name': 'stationary', 'type': 'product', 'price': 10.99})
    product = Product(name='test', price=2.5, type='product')

    # equals to db.save(product)
    doc = product.store(db)
    print doc
    for doc_id in db:
        product = Product.load(db, doc_id)
        # doc = getDoc(db, doc_id)
        # name = doc['name']
        print product

    map_fun = """
                function(doc) {
                    emit(doc._id, doc.price);
                }
              """
    reduce_fun ="_sum"

    # design = {'views': {'sum_p': {
    #                     'map': map,
    #                     'reduce': reduce
    #                     }},
    #           'language': 'python'
    #           }

    db["_design/total_p"] = design

    # results = db.view('total_price/sum_price')
    # for row in results:
    #     print(row.value)