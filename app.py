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



if(False):
    booksDB.addDecade()
    booksDB.splitAuthors()

#################################################
# Flask Routes
#################################################
@app.route("/")
def home():
    print("======================================")
    return render_template("index.html")


@app.route("/decades")
def decades():
    return render_template("decades.html")


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
    kpis_json = {}
    # Get the top 100 books with more comments (first criteria)
    books = list(collection.distinct("title"))
    authors = list(collection.distinct("authors"))
    category = list(collection.distinct("category"))
    
    kpis_json["books"] = len(books)
    kpis_json["authors"] = len(authors)
    kpis_json["category"] = len(category)
    # Send json result
    return jsonify({"kpis": kpis_json})


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

@app.route("/api/v1/books/decade_unique", methods=["GET"])
def get_unique_decade():
    conn = url
    #Add Mongo Validation 
    client = pymongo.MongoClient(conn)
        
    # Define database and collection
    db = client.books_db
    collection = db.book_collection
    unique = collection.distinct('decade')       
    
    # Send json result
    return jsonify({"decade": unique})

@app.route("/api/v1/decade/grouped", methods=["GET"])
def get_group_decade():
    conn = url
    #Add Mongo Validation 
    client = pymongo.MongoClient(conn)
        
    # Define database and collection
    db = client.books_db
    collection = db.book_collection
    grouped = collection.aggregate([{"$group":{"_id":{"decade":"$decade","category":"$category"},"counter":{"$sum":1}}}])

    grouped = list(grouped)  
    books_json=[]
    for group in grouped :
        
        # Build json object
        book_json = {
            "decade" : group["_id"]["decade"],
            "category" : group["_id"]["category"],
            "counter" : group["counter"]
            
        }
        books_json.append(book_json)
      
    
    # Send json result
    return jsonify({"books":books_json})

#function to group by decade and category, counting the number of categories
@app.route("/api/v1/decade/grouped/<decade>", methods=["GET"])
def get_group_decade_param(decade):
    conn = url
    #Add Mongo Validation 
    client = pymongo.MongoClient(conn)
        
    # Define database and collection
    db = client.books_db
    collection = db.book_collection
    grouped = collection.aggregate([{"$match":{"$expr": { "$eq": [ "$decade", int(decade)]}}},{"$group":{"_id":{"category":"$category"},"counter":{"$sum":1}}}])

    grouped = list(grouped)  
    books_json=[]
    for group in grouped :
        # Filter those categories with at least 10 books
       
        # Build json object

          # Remove 'UNKNOWN' or 'false' Categories
        if((group["_id"]["category"] != "false") & (group["_id"]["category"] != "UNKNOWN")):
                # Build json object              

            book_json = {            
                "category" : group["_id"]["category"],
                "counter" : group["counter"]                
            }
            books_json.append(book_json)
      
    
    # Send json result
    return jsonify({"books":books_json})


@app.route("/api/v1/books/authors", methods=["GET"])
def get_books_authors():
    # Get result from books per decade
    books_json = booksDB.getAuthors()
    # Jsonify teh results
    return jsonify({"authors": books_json})

@app.route("/api/v1/books/categories", methods=["GET"])
def get_books_categories():
    # Get result from books per decade
    books_json = booksDB.getCategory()
    # Jsonify teh results
    return jsonify({"categories": books_json})

@app.route("/api/v1/books/authors/<author>", methods=["GET"])
def get_author_history(author):
    print(f"Call to authors: {author}")
    # Get result from books per decade
    authors_json = booksDB.getHistoryByAuthor(author)
    # Jsonify teh results
    return jsonify({"authors": authors_json})


@app.route("/api/v1/decade/grouped/authors/<decade>", methods=["GET"])
def get_groupDecAuthors(decade):
    conn = url
    #Add Mongo Validation 
    client = pymongo.MongoClient(conn)
        
    # Define database and collection
    db = client.books_db
    collection = db.book_collection
    books = list(collection.aggregate([{"$match":{"$expr": { "$eq": [ "$decade", int(decade)]}}},{"$group":{"_id":{"decade":"$decade","category":"$category"},"avgNumPages":{"$avg":"$num_pages"}}}]))
    
     
    books_json=[]
    print(books)
    for book in books:
               
         # Remove 'UNKNOWN' or 'false' Categories
        if((book["_id"]["category"] != "false") & (book["_id"]["category"] != "UNKNOWN")):
                # Build json object                   

            book_json = {
                "decade" : book["_id"]["decade"],  
                "category":book["_id"]["category"],          
                "avgNumPages" : round(book["avgNumPages"],3)
            }
                
        
            books_json.append(book_json)
      
    
    # Send json result
    return jsonify({"books":books_json})

if __name__ == "__main__":
    app.run(debug=True)