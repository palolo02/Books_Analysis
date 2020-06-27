console.log('Loading data');
var books = [];

// Read books from Flask
d3.json("/api/v1/books").then((incomingData) =>{
    
    books = incomingData.books;

    d3.select("#book").append("h3").text(books[0].title);
    d3.select("#book").append("h5").text(books[0].authors);
    d3.select("#book").append("h5").text(books[0].average_rating);
    d3.select("#book").append("h5").text(books[0].num_pages);
    d3.select("#book").append("h5").text(books[0].ratings_count);
    d3.select("#book").append("h5").text(books[0].text_reviews_count);
    d3.select("#book").append("h5").text(books[0].publication_date);
    d3.select("#book").append("h5").text(books[0].publisher);

})

