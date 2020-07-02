// Read books per decade
d3.json("/api/v1/books/timeline/avgRating").then((incomingData) =>{
    
    books = incomingData.books;
    var carousel = d3.select(".carousel-inner");
    // Access each decade to get its books
    var decadesAxis = books.map(b => b["decade"]);
    var booksAxis = books.map(b => b["books"]);
    var avgRatingAxis = books.map(b => b["avgRating"]);
    var avgRatingCountAxis = books.map(b => b["avgRatingCount"]);
    var avgNumPages = books.map(b => b["avgNumPages"]);
    var titles = books.map(b => b["title"]);
    
    //render(books);
    plotAvgRating(decadesAxis, avgRatingAxis);
    plotNoBooks(decadesAxis, booksAxis);
    plotRatingCount(decadesAxis, avgRatingCountAxis);
    plotNoPages(decadesAxis, avgNumPages);
    $("#tabs").tabs();
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
      
      //Plotly.newPlot('noPages', data, layout);
      
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


function plotAvgRating(decadesAxis, avgRatingAxis){
  var trace1 = {
    x: decadesAxis,
    y: avgRatingAxis,
    type: 'bar',
    hoverinfo: 'none',
    text: avgRatingAxis.map(String),
    textposition: 'outside',
    marker: {
      color: 'rgb(142,124,195)',
      opacity: 0.8,
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: 'Average Rating per Decade',
    font:{
      family: 'Raleway, sans-serif'
    },
    showlegend: false,
    xaxis: {
        range: decadesAxis,
        tickangle: -45,
        title: 'Decade',
        titlefont: {
          size: 16,
          color: 'rgb(107, 107, 107)'
        }
    },
    yaxis: {
      zeroline: false,
      range: [0,5],
      title: 'Average Rating of Books',
        titlefont: {
          size: 16,
          color: 'rgb(107, 107, 107)'
        },
    }
  };

      Plotly.newPlot('avgRating', data, layout);
}

function plotNoBooks(decadesAxis, booksAxis){
    
    booksAxisStr = booksAxis.map((b) => b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    var trace1 = {
        x: decadesAxis,
        y: booksAxis,
        type: 'bar',
        hoverinfo: 'none',
        text: booksAxisStr.map(String),
        textposition: 'outside',
        marker: {
          color: 'rgb(142,124,195)',
          opacity: 0.8,
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Number of Books per Decade',
        font:{
          family: 'Raleway, sans-serif'
        },
        showlegend: false,
        xaxis: {
            range: decadesAxis,
            tickangle: -45,
            title: 'Decade',
            titlefont: {
              size: 16,
              color: 'rgb(107, 107, 107)'
            }
        },
        yaxis: {
          zeroline: false,
          range: [0, 8000],
          title: 'Average Number of Books',
            titlefont: {
              size: 16,
              color: 'rgb(107, 107, 107)'
            },
        }
      };

      Plotly.newPlot('noBooks', data, layout);
}

function plotRatingCount(decadesAxis, booksAxis){
  booksAxis = booksAxis.map((b) => (Math.round((b + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

    var trace1 = {
        x: decadesAxis,
        y: booksAxis,
        type: 'bar',
        hoverinfo: 'none',
        text: booksAxis.map(String),
        textposition: 'outside',
        marker: {
          color: 'rgb(142,124,195)',
          opacity: 0.8,
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Rating Comments per Decade',
        font:{
          family: 'Raleway, sans-serif'
        },
        showlegend: false,
        xaxis: {
            range: decadesAxis,
            tickangle: -45,
            title: 'Decade',
            titlefont: {
              size: 16,
              color: 'rgb(107, 107, 107)'
            }
        },
        yaxis: {
          zeroline: false,
          range: [0,40000],
          title: 'Number of Rating Comments',
            titlefont: {
              size: 16,
              color: 'rgb(107, 107, 107)'
            },
        }
      };

      Plotly.newPlot('avgRatingCount', data, layout);
}


function plotNoPages(decadesAxis, avgNumPages){
    
  avgNumPages = avgNumPages.map((b) => (Math.round((b + Number.EPSILON) * 100) / 100));
  var trace1 = {
      x: decadesAxis,
      y: avgNumPages,
      type: 'bar',
      hoverinfo: 'none',
      text: avgNumPages.map(String),
      textposition: 'outside',
      marker: {
        color: 'rgb(142,124,195)',
        opacity: 0.8,
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: 'Average Number of Pages per Decade',
      font:{
        family: 'Raleway, sans-serif'
      },
      showlegend: false,
      xaxis: {
          range: decadesAxis,
          tickangle: -45,
          title: 'Decade',
          titlefont: {
            size: 16,
            color: 'rgb(107, 107, 107)'
          }
      },
      yaxis: {
        zeroline: false,
        range: [0, 600],
        title: 'Average Number of Pages',
          titlefont: {
            size: 16,
            color: 'rgb(107, 107, 107)'
          },
      }
    };

    Plotly.newPlot('noPages', data, layout);
}








