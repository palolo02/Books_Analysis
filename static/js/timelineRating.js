// Read books per decade
d3.json("/api/v1/books/timeline/avgRating").then((incomingData) =>{
    
    books = incomingData.books;
    var carousel = d3.select(".carousel-inner");
    // Access each decade to get its books
    var decadesAxis = books.map(b => b["decade"]);
    var booksAxis = books.map(b => b["books"]);
    var avgRatingAxis = books.map(b => b["avgRating"]);
    var avgRatingCountAxis = books.map(b => b["avgRatingCount"]);
    
    //render(books);
    plot(decadesAxis, avgRatingAxis);
    plotNoBooks(decadesAxis, booksAxis);
    plotRatingCount(decadesAxis, avgRatingCountAxis);
})

d3.json("api/v1/books/decade/2010").then((incomingData) =>{
    books = incomingData.books;
    var x = books.map(b => b["text_reviews_count"]);
    var y = books.map(b => b["average_rating"]);

    var trace1 = {
        x: x,
        y: y,
        mode: 'markers',
        marker: {
          //color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
          opacity: 0.8
          //size: y
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Average Rating vs Text reviews (per dacade)',
        showlegend: false,
        height: 600,
        width: 600
      };
      
      Plotly.newPlot('bubble', data, layout);
});


function render(books){
  console.log('Render')
  var svg = d3.select("#test");
  var margin = 250;
  var width = 800 - margin;
  var height = 800 - margin;

  var xScale = d3.scaleBand().range([0, width]).padding(0.4);
  var yScale = d3.scaleLinear().range([height,0]);

  var g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");

  xScale.domain(books.map(function(d) { return d.decade; }));
  yScale.domain([0, d3.max(books, function(d) { return d.avgRating; })]);

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  g.append("g")
    .call(d3.axisLeft(yScale).tickFormat(function(d){
        return d;
    }).ticks((books.map(b => b["avgRating"]).length)))
    .append("text")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("value");

    g.selectAll(".bar")
    .data(books)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return xScale(d.decade); })
    .attr("y", function(d) { return yScale(d.avgRating); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d.avgRating); });
    
    svg.append("text")
    .attr("transform", "translate(100,0)")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-size", "24px")
    .text('Average Rating Books per Decade')

    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("y", 50)
    .attr("x", 300)
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .text("Decade");

    g.append("g")
    .call(d3.axisLeft(yScale)
    .tickFormat(function(d){
        return d;
    }).ticks(10))
    .append("text")
    .attr("y", 6)
    .attr("dy", "-5.1em")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .text("Average Rating");

    
    svg.selectAll("text")
    .data(books)
    .enter().append("text")
    .text(function(d) { return yScale(d.avgRating)})
    .attr("x", function(d,j) { return xScale(d.decade)*j; })
    .attr("y", function(d) { return yScale(d.avgRating)+0.5; })
    .style('color','black')
    
}


function plot(decadesAxis, avgRatingAxis){
    var trace1 = {
        x: decadesAxis,
        y: avgRatingAxis,
        type: 'bar',
        //text: ['4.17 below the mean', '4.17 below the mean', '0.17 below the mean', '0.17 below the mean', '0.83 above the mean', '7.83 above the mean'],
        marker: {
          color: 'rgb(142,124,195)'
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Average Rating Books per Decade',
        font:{
          family: 'Raleway, sans-serif'
        }
        ,
        showlegend: false,
        xaxis: {
            range: decadesAxis,
            tickangle: -45
        },
        yaxis: {
          zeroline: false,
          autorange: true,
          gridwidth: 2
        },
        bargap :0.05
        
      };

      Plotly.newPlot('avgRating', data, layout);
}

function plotNoBooks(decadesAxis, booksAxis){
    
    
    var trace1 = {
        x: decadesAxis,
        y: booksAxis,
        type: 'bar',
        //text: ['4.17 below the mean', '4.17 below the mean', '0.17 below the mean', '0.17 below the mean', '0.83 above the mean', '7.83 above the mean'],
        marker: {
          color: 'rgb(142,124,195)'
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Number of Books per Decade',
        font:{
          family: 'Raleway, sans-serif'
        }
        /*,
        showlegend: false,
        xaxis: {
          tickangle: -45
        },
        yaxis: {
          zeroline: false,
          gridwidth: 2
        }
        //bargap :0.05
        */
      };

      Plotly.newPlot('noBooks', data, layout);
}

function plotRatingCount(decadesAxis, booksAxis){
    
    
    var trace1 = {
        x: decadesAxis,
        y: booksAxis,
        type: 'bar',
        //text: ['4.17 below the mean', '4.17 below the mean', '0.17 below the mean', '0.17 below the mean', '0.83 above the mean', '7.83 above the mean'],
        marker: {
          color: 'rgb(142,124,195)'
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Books per Decade',
        font:{
          family: 'Raleway, sans-serif'
        }
        /*,
        showlegend: false,
        xaxis: {
          tickangle: -45
        },
        yaxis: {
          zeroline: false,
          gridwidth: 2
        }
        //bargap :0.05
        */
      };

      Plotly.newPlot('avgRatingCount', data, layout);
}


