// Read books per decade
d3.json("/api/v1/books/timeline/avgRating").then((incomingData) =>{
    
    books = incomingData.books;
    var carousel = d3.select(".carousel-inner");
    // Access each decade to get its books
    var decadesAxis = books.map(b => b["decade"]);
    var booksAxis = books.map(b => b["books"]);
    var avgRatingAxis = books.map(b => b["avgRating"]);
    var avgRatingCountAxis = books.map(b => b["avgRatingCount"]);
    
    plot(decadesAxis, avgRatingAxis);
    plotNoBooks(decadesAxis, booksAxis);
    plotRatingCount(decadesAxis, avgRatingCountAxis);
})


function plot(decadesAxis, avgRatingAxis){
    
    var xAxis = [];
    decadesAxis.forEach(x => xAxis.push(`${x}`))
    console.log(xAxis)
    var trace1 = {
        x: xAxis,
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
        title: 'Average Rating Books per Decade',
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
        title: 'Average Rating Books per Decade',
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


function plotBubble(x,y){
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
        title: 'Marker Size and Color',
        showlegend: false,
        height: 600,
        width: 600
      };
      
      Plotly.newPlot('bubble', data, layout);
}