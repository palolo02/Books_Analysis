// Read books per decade
d3.json("/api/v1/books/timeline/avgRating").then((incomingData) =>{
    
    books = incomingData.books;
    var carousel = d3.select(".carousel-inner");
    // Access each decade to get its books
    var decadesAxis = books.map(b => b["decade"]);
    var booksAxis = books.map(b => b["books"]);
    var totalBooks = booksAxis.reduce((a, b) => a + b, 0);
    //booksAxis = books.map(a => (Math.round((a["books"]/totalBooks + Number.EPSILON) * 100) / 100)*100);
    var avgRatingAxis = books.map(b => b["avgRating"]);
    var avgRatingCountAxis = books.map(b => b["avgRatingCount"]);
    var avgNumPages = books.map(b => b["avgNumPages"]);
    var titles = books.map(b => b["title"]);
    
    //render(books);
    plotAvgRating(decadesAxis, avgRatingAxis);
    plotNoBooks(decadesAxis, booksAxis);
    plotRatingCount(decadesAxis, avgRatingCountAxis);
    plotNoPages(decadesAxis, avgNumPages);
    
})

d3.json("api/v1/books/authors").then((incomingData) =>{

  authors = incomingData.authors;

  var x = authors.map(a => a["authors"]);
  var y = authors.map(a => a["Nobooks"]);
  var z = authors.map(a => a["avgRating"]);
  var totalBooks = z.reduce((a, b) => a + b, 0);
  //y = authors.map(a => (Math.round((a["Nobooks"]/totalBooks + Number.EPSILON) * 100) / 100)*100);

  horizontalGraph(x,y,'authors','Authors with highest published books (top 20)','Decade',[0,100]);
  horizontalGraph(x,z,'authorsRating','Authors with highest rating (top 20)','Decade',[0,5]);
  
      
});


d3.json("api/v1/books/categories").then((incomingData) =>{

  categories = incomingData.categories;

  var x = categories.map(a => a["category"]);
  var y = categories.map(a => a["avgRating"]);
  var z = categories.map(a => a["Nobooks"]);
  //var totalBooks = z.reduce((a, b) => a + b, 0);
  //z = categories.map(a => (Math.round((a["Nobooks"]/totalBooks + Number.EPSILON) * 100) / 100)*100);
  
  

  //horizontalGraph(x,y,'authors')
  horizontalGraph(x,z,'category',`Top 10`,'No books published',[0,4500]);
      
});


// Historical Rating
d3.json("/api/v1/books/authors/Stephen%20King").then((incomingData) =>{

  historical = incomingData.authors;

  var x = historical["decades"].map(a => a["_id"]);
  var y = historical["decades"].map(a => a["avgRating"]);
  var author = historical["author"]
  
  historicalGraph(x,y,author);
      
});


function historicalGraph(x,y,author){
  var trace1 = {
    x: x,
    y: y,
    type: 'scatter',
    orientation: 'h',
    text: y.map(String),
    textposition: 'outside',
    marker: {
      color: 'rgb(40,134,142)',
      opacity: 0.8,
    },
    xaxis: {
      title: 'Decades',
      zeroline: true,
      titlefont: {
        size: 10,
        color: 'rgb(107, 107, 107)'
      }
    },
    yaxis: {
      titlefont: {
        size: 10,
        color: 'rgb(107, 107, 107)'
      }
    }
  };
    
  var data = [trace1];
  
  var layout = {
    title: `Historical Max Rating ${author}`,
    showlegend: false
  };

  Plotly.newPlot('authorsDecade', data, layout, {displayModeBar: false}, {responsive: true});

}

function horizontalGraph(x,y,id,title,xTitle, range){
  
  var trace1 = {
    x: y,
    y: x,
    type: 'bar',
    orientation: 'h',
    text: y.map(String),
    textposition: 'outside',
    marker: {
      color: 'rgb(40,134,142)',
      opacity: 0.8,
    },
    xaxis: {
      title: xTitle,
      zeroline: true,
      titlefont: {
        size: 7,
        color: 'rgb(107, 107, 107)'
      }
    },
    yaxis: {
      titlefont: {
        size: 7,
        color: 'rgb(107, 107, 107)'
      }
    }
  };
    
  var data = [trace1];
  
  var layout = {
    title: title,
    showlegend: false,
    xaxis :{
      range: range,
      titlefont: {
        size: 5,
        color: 'rgb(107, 107, 107)'
      }
    },
    yaxis: {
      automargin: true,
      ticktext:x,
      titlefont: {
        size: 7,
        color: 'rgb(107, 107, 107)'
      }
    }
  };

  Plotly.newPlot(id, data, layout, {displayModeBar: false}, {responsive: true});
}


setTimeout(function(){ 
  $("#tabStatistics").tabs();
  $("#tabAuthors").tabs();
}, 1500);


function plotAvgRating(decadesAxis, avgRatingAxis){
  var trace1 = {
    x: decadesAxis,
    y: avgRatingAxis,
    type: 'bar',
    hoverinfo: 'none',
    text: avgRatingAxis.map(String),
    textposition: 'outside',
    marker: {
      color: 'rgb(40,134,142)',
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

      Plotly.newPlot('avgRating', data, layout, {displayModeBar: false});
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
          color: 'rgb(40,134,142)',
          opacity: 0.8,
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Number of Published Books per Decade',
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
          range: [0, 7500],
          title: 'Published Books',
            titlefont: {
              size: 16,
              color: 'rgb(107, 107, 107)'
            },
        }
      };

      Plotly.newPlot('noBooks', data, layout, {displayModeBar: false});
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
          color: 'rgb(40,134,142)',
          opacity: 0.8,
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Average Rating Comments per Decade',
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

      Plotly.newPlot('avgRatingCount', data, layout, {displayModeBar: false});
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
        color: 'rgb(40,134,142)',
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

    Plotly.newPlot('noPages', data, layout, {displayModeBar: false}, {responsive: true});
}








