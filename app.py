#################################################
# Import Modules
#################################################

from flask import Flask
from flask import render_template
from flask import redirect
from flask import jsonify
from flask import request
from collections import OrderedDict
import math
from datetime import datetime
import pymongo
import booksDB

#################################################
# DB Connection
#################################################

app = Flask(__name__)

url = f'mongodb://localhost:27017/books_db'
if(True):
    booksDB.addDecade()

#################################################
# Flask Routes
#################################################
@app.route("/")
def home():
    print("======================================")
    return render_template("index.html")

@app.route("/api/v1/books", methods=["GET"])
def get_books():
    # Add Mongo Validation
    conn = url
    client = pymongo.MongoClient(conn)
    
    # Define database and collection
    db = client.books_db
    collection = db.book_collection
    
    # Get the top 100 books with more comments (first criteria)
    books = collection.find().sort("ratings_count",-1).limit(100)
    
    # list of json objects
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
            "cetegory" : book["category"]
        }
        # Add element to list
        books_json.append(book_json)

    # Sort by average rating (descending) (second criteria)
    books_json = sorted(books_json, key = lambda k:k['average_rating'], reverse=True)
    # Send json result
    return jsonify({"books": books_json})

@app.route("/api/v1/books/decade", methods=["GET"])
def get_books_decade():
    # Get result from books per decade
    books_json = booksDB.getBooksperDecade()
    # Jsonify teh results
    return jsonify({"books": books_json})
# Top 100 by pages and rating
@app.route("/api/v1/pages", methods=["GET"])
def get_pages():
    # Add Mongo Validation
    conn = url
    client = pymongo.MongoClient(conn)
    
    # Define database and collection
    db = client.books_db
    collection = db.book_collection
    
    # Get the top 100 books with more comments (first criteria)
    books = collection.find().sort("ratings_count",-1).limit(50)
    
    # list of json objects
    books_json = []

    # Iterate through collection to build the list
    for book in books:
        book_json = {
            "title" : book["title"],
            "authors" : book["authors"],
            "average_rating" : book["average_rating"],
            "isbn" : book["isbn"],
            "num_pages":book["num_pages"],
            "ratings_count" : book["ratings_count"],
            "publication_date" : book["publication_date"],
            "text_reviews_count" : book["text_reviews_count"],
            "cetegory" : book["category"]
        }
        # Add element to list
        books_json.append(book_json)

    # Sort by page numbers (descending) (second criteria)
    books_json = sorted(books_json, key = lambda k:k['num_pages'], reverse=True)
    print(book_json)
    # Send json result
    return jsonify({"books": books_json})

# KPIs
@app.route("/api/v1/kpi", methods=["GET"])
def get_kpi():
    # Add Mongo Validation
    conn = url
    client = pymongo.MongoClient(conn)
    
    # Define database and collection
    db = client.books_db
    collection = db.book_collection
    
    # Get the top 100 books with more comments (first criteria)
    books = collection.count()
    
   
    # Send json result
    return jsonify({"books": books})


@app.route("/api/v1/books/timeline/avgRating", methods=["GET"])
def get_books_timeline_avgRating():
    # Get result from books per decade
    books_json = booksDB.getBooksTimelineAvgRating()
    # Jsonify teh results
    return jsonify({"books": books_json})

@app.route("/api/v1/books/decade/<decade>", methods=["GET"])
def get_books_decade_selection(decade):
    # Get result from books per decade
    books_json = booksDB.getBooksByDecadeSel(int(decade))
    # Jsonify teh results
    return jsonify({"books": books_json})


if __name__ == "__main__":
    app.run(debug=True)