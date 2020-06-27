#################################################
# Import Modules
#################################################

from flask import Flask
from flask import render_template
from flask import redirect
from flask import jsonify
import pymongo

#################################################
# DB Connection
#################################################

app = Flask(__name__)

url = f'mongodb://localhost:27017/books_db'


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
    print(collection)
    # Desc order
    books = collection.find().sort("ratings_count",-1).limit(100)
    print("==============================")
    print(books)
    books_json = []
    # Iterate through collection
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
        books_json.append(book_json)
    
    return jsonify({"books": books_json})




if __name__ == "__main__":
    app.run(debug=True)