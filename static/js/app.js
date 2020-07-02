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
    d3.select("#book").append("h5").text(books[0].category);

});


d3.json("/api/v1/pages").then((incomingData) =>{
    
    books = incomingData.books;
    
    var trace1 = {
        x: books.map((d)=>d.average_rating),
        y: books.map((d)=>d.num_pages),
        text: books.map((d)=> d.title),
        mode: 'markers',
        marker: {
            color:books.map((d)=>d.num_pages) ,
            size: books.map((d)=>d.average_rating*8)
        }
    }
    var layout = {
        title: 'No Pages vs Average Rating (top 50)',
        font:{
          family: 'Raleway, sans-serif'
        },
        showlegend: false,
        height: 500,
        width: 700,
        xaxis:{title:"Rating"},
        yaxis:{title:"No. pages"}
        };
        
    Plotly.newPlot("books_pages",[trace1],layout);
    

});

d3.json("/api/v1/kpi").then((incomingData) =>{
    
    books = incomingData.books;

    // create svg element:
    var svg = d3.select("#books_count").append("svg").attr("width", 200).attr("height", 200)
    var g = svg.append("g")

    // Add the path using this helper function
   var circle = g.append('circle')
    .attr('cx', 100)
    .attr('cy', 100)
    .attr('r', 50)
    .attr('stroke', 'none')
    .attr('fill', '#69a3b2')
    .attr('opacity',0.7)
    .append("text");

    g.append("text")
    .attr("x", 50)
    .attr("y", 100)
    .attr("stroke", "white")
    .text("Authors");
    

    

});


