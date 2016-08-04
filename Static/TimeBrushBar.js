/*
  Only Bar Chart with Time Brush
  Last Edit: July 27, 2016
*/

var width = 960,
    height = 300,
    height2=20, 
    margin=50;
var selected = [];
var categoryList, colorCategory;

// Default Variable Values
var step=1.2;
var timeSelector= "month";
var allCategories = ["Achievement", "News", "Event", "Seminar", "ThesisDefense"];

// Time Parser
var parseDate = d3.time.format("%Y-%m-%d").parse;

var barSVG = d3.select("body").append("svg")
    .attr("width", width + 2 * margin)
    .attr("height", height + 4 * margin + 2 * height2)
    .attr("id", "barChart");

// clip path needed for brush
barSVG.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

// Creates new 2D brush and binds event listener -- see brushed()
var brush = d3.svg.brush()
    .on("brush",brushed);

// Sets time scale for axes
var xF = d3.time.scale()
    .range([0, width]);

var xC = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0])
    .nice();

// Bar Graph xAxis
var xFAxis = d3.svg.axis()
    .scale(xF)
    .orient("bottom")
    //.tickFormat(d3.time.format("%b %Y"))

// Bar Graph yAxis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);

// Time Brush Axis
var xCAxis = d3.svg.axis()
    .scale(xC)
    .orient("top")
    //.tickFormat(d3.time.format("%b %Y"))

// Append group in svg for MAIN GRAPH
var mainPageBar = barSVG.append("g")
    .attr("class","mainPageBar")
    .attr("transform","translate(" + margin + "," + (height2 + margin) + ")");

// Append a group in svg for TIME BRUSH
var timeBrush = barSVG.append("g")
    .attr("class", "timeBrush")
    .attr("transform", "translate(" + margin + "," + margin + ")");

// call display function
display(allCategories);

function display(selected) {
  d3.json("current.json",function(error,data) {
    if (error) throw error;

    // Reorder the data by Category
      // value is an array of objects where "key" is the category and "values" is the number of articles in that category
    var orderByCategory = d3.nest()
        .key(function(d){return d.category}).sortKeys(d3.ascending)
        .rollup(function(leaves){return leaves.length})
        .entries(data)

    // Reorder the data by Date
      // an array of objects where "key" is the date and "values" is the number of articles on that date
    var orderByDate = d3.nest()
        .key(function(d){return d.date}).sortKeys(d3.ascending)
        .rollup(function(leaves){return leaves.length})
        .entries(data)

    // reorder data by Date and then by Category
      // array of objects where "key" is the date and "values" is another array of objects where "key" is the date and "values" is the number of articles
    var orderByDateByCategory = d3.nest()
        .key(function(d){return d.date}).sortKeys(d3.ascending)
        .key(function(d){return d.category}).sortKeys(d3.ascending)
        .rollup(function(leaves){return leaves.length;})
        .entries(data);

    // create an array for the category names
    var categoryList = d3.set(orderByCategory.map(function(d){return d.key})).values().sort(d3.ascending);

    // Map data based on DAY
    var numAchievement = d3.range(orderByDate.length).map(function(){return 0});
    var numEvent = d3.range(orderByDate.length).map(function(){return 0});
    var numNews = d3.range(orderByDate.length).map(function(){return 0});
    var numThesis = d3.range(orderByDate.length).map(function(){return 0});
    var numSeminar = d3.range(orderByDate.length).map(function(){return 0})

    var dayNode = d3.range(orderByDate.length).map(function(d,i) {
        var category = orderByDateByCategory[i].values;
        
        for (var n = 0; n <= category.length - 1; n++) {
            switch(category[n].key) {
              case "News":
                if (selected.indexOf("News") == -1) {
                  numNews[i] = 0;
                } else {
                  numNews[i]=category[n].values;
                }
              break;

              case "Achievement":
                if (selected.indexOf("Achievement") == -1) {
                  numAchievement[i] = 0;
                } else {
                  numAchievement[i]=category[n].values;
                }
              break;

              case "Event":
                if (selected.indexOf("Event") == -1) {
                  numEvent[i] = 0;
                } else {
                  numEvent[i]=category[n].values;
                }
              break;

              case "ThesisDefense":
                if (selected.indexOf("ThesisDefense") == -1) {
                  numThesis[i] = 0;
                } else {
                  numThesis[i]=category[n].values;
                }
              break;

              case "Seminar":
                if (selected.indexOf("Seminar") == -1) {
                  numSeminar[i] = 0;
                } else {
                  numSeminar[i]=category[n].values;
                }
              break;
            }
        };

        return {date:parseDate(orderByDate[i].key),
            year:moment(orderByDate[i].key,"YYYY-MM-DD").year()-2002,
            month:moment(orderByDate[i].key,"YYYY-MM-DD").month()-6+(moment(orderByDate[i].key,"YYYY-MM-DD").year()-2002)*12,
            week:Math.floor((moment(orderByDate[i].key,"YYYY-MM-DD").unix()-moment(orderByDate[0].key,"YYYY-MM-DD").unix())/(60*60*24*7)),
            //day:moment(orderByDate[i].key,"YYYY-MM-DD").day(),
            numberOfArticles:orderByDate[i].values,
            Achievement:numAchievement[i],
            Event:numEvent[i],
            News:numNews[i],
            ThesisDefense:numThesis[i],
            Seminar:numSeminar[i]
        }
    })

    // Creates Nodes for day, week, month, year
    function createNode(timePeriod) {
      var Node = d3.nest()
          .key(function(d){return d[timePeriod]})
          //.sortKeys(d3.ascending)
          .rollup(function(leaves) {
            return {
              "Achievement":d3.sum(leaves,function(d){return d.Achievement;}),
              "Event":d3.sum(leaves,function(d){return d.Event;}),
              "News":d3.sum(leaves,function(d){return d.News;}),
              "ThesisDefense":d3.sum(leaves,function(d){return d.ThesisDefense;}),
              "Seminar":d3.sum(leaves,function(d){return d.Seminar;}),
            }
          })
          .entries(dayNode)
      return Node;
    }
  
    // Map data based on MONTH
    var weekNode = createNode("week");
    weekNode = weekNode.map(function(d) {
      var c = d.values;
        return {
          date: parseDate(moment.unix((d.key)*60*60*24*7+moment(orderByDate[0].key,"YYYY-MM-DD").unix()).format("YYYY-MM-DD")),
          Achievement: c.Achievement,
          Event: c.Event,
          News: c.News,
          ThesisDefense: c.ThesisDefense,
          Seminar:c.Seminar
        }
    })

    // Map the data based on MONTH
    var monthNode = createNode("month");
    monthNode = monthNode.map(function(d) {
      var c = d.values;
        return {
          date: parseDate(moment(orderByDate[0].key,"YYYY-MM-DD").add(d.key,"month").format("YYYY-MM-DD")),
          Achievement: c.Achievement,
          Event: c.Event,
          News: c.News,
          ThesisDefense: c.ThesisDefense,
          Seminar:c.Seminar   
        }
    })

    // Map the data based on YEAR
    var yearNode = createNode("year");
    yearNode = yearNode.map(function(d) {
      var c = d.values;
        return {
          date: parseDate(moment(orderByDate[0].key,"YYYY-MM-DD").add(d.key,"year").format("YYYY-MM-DD")),
          Achievement: c.Achievement,
          Event: c.Event,
          News: c.News,
          ThesisDefense: c.ThesisDefense,
          Seminar:c.Seminar   
        }
    })

    // each category corresponds to a color
    colorCategory = d3.scale.ordinal()
      .domain(categoryList)
      .range(['#5fc5aa','#f084ac','#5a92f2','#ffa345','#b640f1','#b2ff69']);

    // Draw Label        
    var labelBoxes = barSVG.selectAll(".label")
      .data(orderByCategory)
      .enter()
      .append("g")
      .attr("class","label");

    var labelRect = labelBoxes.append("rect")
      .attr("x",20+margin)
      .attr("y",function(d,index) {
          return margin+height2+20+index*30;
      })
      .attr("width",20)
      .attr("height",20)
      .attr("fill",function(d) {
          if(d == "Unknow") return "#999";
          return colorCategory(d.key);
      })
      .attr("opacity",0.4);
    var labelText = labelBoxes.append("text")
      .text(function(d) {
          if (d.key == "ThesisDefense") return "Thesis Defense";
          return d.key;
      })
      .style("fill","#666")
      .attr("x", 60+margin)
      .attr("y",function(d,index) {
          return margin+height2+35+index*30;
      });

    // Choose to analyze based on day, week or month
    var dateNode;

    switch(timeSelector){
      case "day":
      dateNode = dayNode;
      break;

      case "week":
      dateNode = weekNode;
      break;

      case "month":
      dateNode = monthNode;
      break;

      case "year":
      dateNode = yearNode;
      break;
    }

    var n = orderByCategory.length,   // number of category
        m = dateNode.length ;  // number of samples per layer

    // Generate the stack layout
    stack = d3.layout.stack()//.offset("wiggle")

    layers = stack(categoryList.map(function(c) {
      return d3.range(m).map(function(d,i) {
        return {x: dateNode[i].date, y: dateNode[i][c]};
      });
    }));

    // Domain of the x axis: the earliest date and the latest date
    xF.domain(d3.extent(layers[0].map(function(d) { return d.x; })))
    
    xC.domain(xF.domain());

    // Show the start time and the end time
    d3.select("#startTime").html(moment(xF.domain()[0]).format("YYYY-MMM-DD"));
    d3.select("#endTime").html(moment(xF.domain()[1]).format("YYYY-MMM-DD"))

    brush.x(xC)
    y.domain([0, d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])

    // Draw the bar chart
    var focusLayer=mainPageBar.selectAll(".layer")
        .data(layers)
      .enter().append("g")
      .attr("clip-path", "url(#clip)")
        .attr("class", "layer")
        .style("fill", function(d,i){return colorCategory(categoryList[i])})
         .attr("opacity",1)
        // .on("mouseover",function(){
        //   d3.select("this").attr("opacity",1)})
        //  .on("mouseout",function(){
        // d3.select(this).attr("opacity",0.8)})

        focusLayer.selectAll("rect")
        .data(function(d) { return d; })
      .enter().append("rect")
        .attr("class","rect")
        .attr("x",function(d) { return xF(d.x); })
        .attr("y",function(d) { return y(d.y0+d.y); })
        .attr("height",function(d) { return y(d.y0) - y(d.y + d.y0);})
        .attr("width",(xF(layers[0][1].x)-xF(layers[0][0].x))/step);

    // Draw the x axis in the main graph
    mainPageBar.append("g")
        .attr("class", "xFAxis")
        .attr("transform", "translate(0,"+(height+5)+" )")
        .call(xFAxis)
      .append("text")
        .attr("x", 20)
        .attr("y", 40)
        .style("text-anchor", "middle")
        .text("Time");

    // Draw the y axis in the main graph
    mainPageBar.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(0,0)")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Articles");

    // Draw the x axis in the time brush
    timeBrush.append("g")
        .attr("class", "xCAxis")
        .attr("transform", "translate(0, 0)")
        .call(xCAxis);

    // Call the brush
    timeBrush.append("g")
        .attr("class", "x brush")
        .call(brush)
      .selectAll("rect")
        .attr("y", -margin/2)
        .attr("height", margin);

  });
}
// end of json function

//function for the brush
function brushed() {
  xF.domain(brush.empty() ? xC.domain() : brush.extent());

  var time = brush.extent();
  brush.extent([d3.time.day.floor(time[0]), d3.time.day.ceil(time[1])]);

  mainPageBar.selectAll(".rect")
      .attr("x", function(d) { return xF(d.x); })
      .attr("y", function(d) { return y(d.y + d.y0); })
      .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
      .attr("width",(xF(layers[0][1].x)-xF(layers[0][0].x))/step);

  mainPageBar.select(".xFAxis").call(xFAxis);

  d3.select("#startTime").html(moment(xF.domain()[0]).format("YYYY-MMM-DD"));
  d3.select("#endTime").html(moment(xF.domain()[1]).format("YYYY-MMM-DD"));
}

// Clear the brush
function resetBrush() {
  d3.selectAll(".brush").call(brush.clear()) ;
  brushed();
}

function resetGraph() {
  d3.selectAll(".layer").remove();
  d3.selectAll('.xCAxis').remove();
  d3.selectAll('.xFAxis').remove();
  d3.selectAll('.yAxis').remove();
  resetBrush();
  if (selected.length == 0) { display(allCategories); } 
  else {display(selected); }
}

// called when DAY button is clicked
function day(){
  step=4;
  timeSelector="day";
  resetGraph();
}

// called when WEEK button is clicked
function week(){
  timeSelector="week";
  step=8;
  resetGraph();
}

// called when MONTH button is clicked
function month(){
  step=1.2;
  timeSelector="month";
  resetGraph();
}

// called when YEAR button is clicked
function year(){
  step=1;
  timeSelector="year";
  resetGraph();
}

function filterGo() {
  selected = [];
  for (var i = 0; i < allCategories.length; i++)
  {
    if (document.getElementById(allCategories[i]).checked)
    {
      selected.push(allCategories[i]);
    }
  }
  resetGraph();
}
