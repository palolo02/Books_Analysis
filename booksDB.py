from collections import OrderedDict
import math
from datetime import datetime
import pymongo
import config

# Mongo connection
url = f'mongodb://localhost:27017/books_db'


def addDecade():
    print("Adding decade!")
    # Initialize connection
    conn = url
    client = pymongo.MongoClient(conn)
    # Set Db and collection
    db = client.books_db
    collection = db.book_collection

    # Get number of books per year
    books = collection.find()

    # Cast to list
    books = list(books)
    # Iterate through collection to build the list
    for book in books:
        decade = math.floor((book["publication_date"].year)%100/10)*10 
        if(book["publication_date"].year >= 2000):
            if(decade<10):
                decade = f"200{decade}"
            else:
                decade = f"20{decade}"
        else:
            decade = f"{decade}"
        # Update decade field for each document
        collection.update_one({"_id":book["_id"]},{"$set":{"decade":int(decade)}})
        

# Function to get top 10 books per decade based on higher rating counts
def getBooksperDecade():
    # Add Mongo Validation
    conn = url
    client = pymongo.MongoClient(conn)
    
    # Define database and collection
    db = client.books_db
    collection = db.book_collection
    
    # Get number of books per year
    books = collection.find().sort([("decade",1),("ratings_count",-1)])
    #books = collection.aggregate([{"$group":{"_id":"$decade","books":{"$sum":1}}}])
    # Cast to list
    decade_list = collection.distinct("decade")
    
    books_json = []

    # Iterate through collection to build the list
    #for book in books:
    for decade in decade_list:
        books = collection.find({"decade":decade}).sort([("ratings_count",-1)]).limit(10)
        books = list(books)
        
        books_json_decade = []

        # Iterate through collection to build the list
        for book in books:
            book_json = {
                "title" : book["title"],
                "authors" : book["authors"],
                "average_rating" : book["average_rating"],
                "isbn" : book["isbn"],
                "ratings_count" : book["ratings_count"],
                "publication_date" : book["publication_date"],
                "text_reviews_count" : book["text_reviews_count"],
                "category" : book["category"],
                "decade" : book["decade"]
            }
            books_json_decade.append(book_json)
        
        books_json_decade = sorted(books_json_decade, key = lambda k:k['average_rating'], reverse=True)
        books_json.append(books_json_decade)
    return books_json
    

# Function to get top 10 books per decade based on higher rating counts
def getBooksTimelineAvgRating():
    # Add Mongo Validation
    conn = url
    client = pymongo.MongoClient(conn)
    
    # Define database and collection
    db = client.books_db
    collection = db.book_collection

    books_json = []
    # Get number of books per year
    #books = collection.find().sort([("decade",1),("ratings_count",-1)])
    books = collection.aggregate([{"$group":{"_id":"$decade","avgRating":{"$avg":"$average_rating"},"books":{"$sum":1},"avgRatingCount":{"$avg":"$ratings_count"}}}])
    
    books = list(books)
    for book in books:
        book_json = {
            "decade" : book["_id"],
            "avgRating" : round(book["avgRating"],3),
            "books" : book["books"],
            "avgRatingCount" : round(book["avgRatingCount"],3)
        }
        books_json.append(book_json)
    # Sort per decade in ascending order
    books_json = sorted(books_json, key = lambda k:k['decade'], reverse=False)
    return books_json
    

# Function to get top 10 books per decade based on higher rating counts
def getBooksByDecadeSel(decade):
    # Add Mongo Validation
    conn = url
    client = pymongo.MongoClient(conn)
    
    # Define database and collection
    db = client.books_db
    collection = db.book_collection
    # Cast to list
    books = collection.find({"decade":decade})
    books = list(books)
    books_json = []

    # Iterate through collection to build the list
    for book in books:
        book_json = {
            "title" : book["title"],
            "authors" : book["authors"],
            "average_rating" : book["average_rating"],
            "isbn" : book["isbn"],
            "ratings_count" : book["ratings_count"],
            "publication_date" : book["publication_date"],
            "text_reviews_count" : book["text_reviews_count"],
            "category" : book["category"],
            "decade" : book["decade"]
        }
        books_json.append(book_json)
    
    return books_json
