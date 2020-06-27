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
    # Groupping if necessary
    books = collection.find_one()
    print("==============================")
    print(books)

    book = [{
        "title" : books["title"],
        "authors" : books["authors"],
        "average_rating" : books["average_rating"],
        "isbn" : books["isbn"],
        "ratings_count" : books["ratings_count"],
        "publication_date" : books["publication_date"],
        "publisher" : books["publisher"],
        "text_reviews_count" : books["text_reviews_count"]
    }]
    return jsonify({"books": book})




if __name__ == "__main__":
    app.run(debug=True)