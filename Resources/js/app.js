console.log('Loading data');

var books = [];

// Read books from Flask
d3.json("/api/v1/books").then((incomingData) =>{
    books = incomingData;
    console.log(incomingData);
})