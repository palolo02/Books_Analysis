// Read books per decade
d3.json("/api/v1/books/decade").then((incomingData) =>{
    
    books = incomingData.books;
    var carousel = d3.select(".carousel-inner");
    // Access each decade to get its books
    books.forEach(decade => {
        var enableClass = false
        if(decade[0]["decade"] == 0)
            var enableClass = true
        
        var item = carousel.append("div").classed("carousel-item",true).classed("active",enableClass);

        // Get the container to append div for books
        decade.forEach(book => {
            var div = item.append("div").classed("book",true).classed("col-1",true)
            div.append("h4").text("Title: " + book.title);
            div.append("span").text("Author: " + book.authors);
            div.append("span").text("Rating: " + book.average_rating);
            div.append("span").text("Rates: " + book.ratings_count);
        });
        
    });
    

})

