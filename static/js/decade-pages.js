// select the selData
var dropDown = d3.select("#selDataset");
dropDown.on("change",optionChanged);


// extracting the decades of the dropdown values that will be used in the selection
d3.json("/api/v1/books/decade_unique").then((incomingData) =>{
     var decade = incomingData.decade ;   
    selData(decade);  
    //console.log(decade)     
   
          
});
// function to add the options for the dropdown
function selData(decade){
    var selector = d3.select("#selDataset");
    var option;
    
    decade.forEach((decade)=>{
        option=selector.append("option").text(decade).attr("value",decade);       

    });
}
function optionChanged(){
    var elDrop = parseInt(dropDown.property("value"));
   
    var f = d3.format(".2f");
    var test= d3.select("#test")
    test.html("");
    // Read books per decade
    d3.json(`/api/v1/decade/grouped/${elDrop}`).then((incomingData) =>{
        books = incomingData.books;
        console.log(books);
        var x = books.map((d)=> d.category)
        var y = books.map((d)=>d.counter)
        console.log(x)
        console.log(y)
        var trace1 = {
            x: y,
            y: x,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(142,124,195)',
                opacity: 0.8,
            }
            };
            
            var data = [trace1];
            
            var layout = {
            title: 'Categories per decade',
            showlegend: false
            };
            
        Plotly.newPlot('graphic', data, layout);
       

    })

}
