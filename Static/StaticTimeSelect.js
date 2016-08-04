/*
  Distinguishes by Category Only -- uses selection for Time
  instead of Time Brush
  Last Edit: August 2, 2016
*/  

var width = 960,
    height = 300,
    height2=20, 
    margin=50;
var selectCategories = [];
var selectDepts = [];
var categoryList, colorCategory;
var earliestDate = "2002-07-01";
var latestDate = "2016-07-14";

// Default Variable Values
var fileName = "current.json";
var step=1.2;
var timeSelector= "month";
var colors = ['#5fc5aa','#f084ac','#5a92f2','#ffa345','#b640f1','#b2ff69'];
var allCategories = ["Achievement", "Event", "News", "Seminar", "ThesisDefense"];
var allDepts = ["CBME","CEE", "CSE", "ECE", "IELM", "MAE"];
var startDate = earliestDate;
var endDate = latestDate;
var selectCategories = allCategories;
var selectDepts = allDepts;

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

// Sets time scale for axes
var xF = d3.time.scale()
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

// Append group in svg for MAIN GRAPH
var mainPageBar = barSVG.append("g")
    .attr("class","mainPageBar")
    .attr("transform","translate(" + margin + "," + (height2 + margin) + ")");

// START PIE CHART CODE
var widthPie = 400,
    heightPie = 350,
    maxRadius = 150,
    minRadius = 50,
    brushH = 40, // brush height
    marginPie = 0;

// Create SVG
var pieSVG=d3.select("body").append("svg")
       .attr("width",widthPie+2*marginPie)
       .attr("height", heightPie+2*marginPie)
       .attr("id", "pieChart");

  pieSVG.append("defs").append("clipPath")
    .attr("class","clip")
    .append("rect")
    .attr("width",widthPie)
    .attr("height",heightPie);

//a r scaler 
var r = d3.scale.linear()
       .range([minRadius, maxRadius]);

//append a group in the svg for the pie chart
var mainPie=pieSVG.append("g")
    .attr("class","pie")
    .attr("transform","translate("+(widthPie/2+marginPie)+","+(heightPie/2+marginPie)+")");

//define pie layout
var pie=d3.layout.pie()
    .value(function(d){return d.values})
    .padAngle(0);

//a path generator for arc
var arc=d3.svg.arc()
    .innerRadius(0);
// END PIE CHART CODE


// call display function
//display(allCategories, allDepts);
display();

//function display(selectCategories, selectDepts) {
function display() {
  d3.json(fileName,function(error,data) {
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

    // creates array of category types
    categoryList = d3.set(orderByCategory.map(function(d){return d.key})).values().sort(d3.ascending);
    //allCategories = categoryList;

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
                if (selectCategories.indexOf("News") == -1) {
                  numNews[i] = 0;
                } else {
                  numNews[i]=category[n].values;
                }
              break;

              case "Achievement":
                if (selectCategories.indexOf("Achievement") == -1) {
                  numAchievement[i] = 0;
                } else {
                  numAchievement[i]=category[n].values;
                }
              break;

              case "Event":
                if (selectCategories.indexOf("Event") == -1) {
                  numEvent[i] = 0;
                } else {
                  numEvent[i]=category[n].values;
                }
              break;

              case "ThesisDefense":
                if (selectCategories.indexOf("ThesisDefense") == -1) {
                  numThesis[i] = 0;
                } else {
                  numThesis[i]=category[n].values;
                }
              break;

              case "Seminar":
                if (selectCategories.indexOf("Seminar") == -1) {
                  numSeminar[i] = 0;
                } else {
                  numSeminar[i]=category[n].values;
                }
              break;
            }
        };

        return {
          date:parseDate(orderByDate[i].key),
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
      .range(colors);

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
    xF.domain([parseDate(startDate), parseDate(endDate)])

    // Y Axis
    y.domain([0, d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])

  // DRAW BAR CHART
    // Draw the bar chart
    var focusLayer=mainPageBar.selectAll(".layer")
        .data(layers)
      .enter().append("g")
      .attr("clip-path", "url(#clip)")
        .attr("class", "layer")
        .style("fill", function(d,i){return colorCategory(categoryList[i])})
         .attr("opacity",1)
    //     .on("mouseover",function(){
    //       d3.select(this).attr("opacity",1)})
    //      .on("mouseout",function(){
    //     d3.select(this).attr("opacity",0.8)})

      focusLayer.selectAll("rect")
        .data(function(d) { return d; })
      .enter().append("rect")
        .attr("class","rect")
        .attr("x",function(d) { return xF(d.x); })
        .attr("y",function(d) { return y(d.y0+d.y); })
        .attr("height",function(d) { return y(d.y0) - y(d.y + d.y0);})
        .attr("width",(xF(layers[0][1].x)-xF(layers[0][0].x))/step);
  // END BAR CHART

    drawAxes();
    //displayList(data);
    filterArticles();
    filterPie();

  });
// end of json function
}

function drawAxes() {
  // DRAW AXES
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
  // END DRAW AXES
}

function resetGraph() {
    d3.selectAll(".layer").remove();
    d3.selectAll('.xCAxis').remove();
    d3.selectAll('.xFAxis').remove();
    d3.selectAll('.yAxis').remove();
    filterBar();
    /*
    if (selectCategories.length == 0) 
      { 
        if (selectDepts.length == 0) {
          display(allCategories, allDepts);
        }
        else { display(allCategories, selectDepts); }
      } 
    else {display(selectCategories, selectDepts); }
    */
    //if (selectCategories.length == 0) { display(allCategories); } else {display(selectCategories); }
    display()
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

// reset to default filters
function defaultFilter() {
  selectCategories = allCategories;
  selectDepts = allDepts;

  //Earliest Date: 2002-07-09 Latest Date: 2016-07-14
  document.getElementById("startMonth").options[6].selected = true;
  document.getElementById("startDay").options[8].selected = true;
  document.getElementById("startYear").options[14].selected = true;

  document.getElementById("endMonth").options[6].selected = true;
  document.getElementById("endDay").options[13].selected = true;
  document.getElementById("endYear").options[0].selected = true;

  selectAllCategories();
  month();
}

// Gets all the filtered/selected values and calls functions to display new graphs
function filterGo() {
  var startMonth = d3.select("#startMonth").node().value; 
  var startDay = d3.select("#startDay").node().value; 
  var startYear = d3.select("#startYear").node().value; 
  var endMonth = d3.select("#endMonth").node().value; 
  var endDay = d3.select("#endDay").node().value; 
  var endYear = d3.select("#endYear").node().value; 
  startDate = startYear + "-" + startMonth + "-" + startDay
  endDate = endYear + "-" + endMonth + "-" + endDay

  selectCategories = [];
  for (var i = 0; i < allCategories.length; i++)
  {
    if (document.getElementById(allCategories[i]).checked)
    {
      selectCategories.push(allCategories[i]);
    }
  }
  selectDepts = [];
  for (var i = 0; i < allDepts.length; i++) {
    if (document.getElementById(allDepts[i]).checked)
    {
      selectDepts.push(allDepts[i]);
    }
  }

  resetGraph();
}

function filterBar() {
  mainPageBar.selectAll(".rect")
      .attr("x", function(d) { return xF(d.x); })
      .attr("y", function(d) { return y(d.y + d.y0); })
      .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
      .attr("width",(xF(layers[0][1].x)-xF(layers[0][0].x))/step);

  mainPageBar.select(".xFAxis").call(xFAxis);
}

function filterPie() {
  mainPie.selectAll("path").remove()

  d3.json(fileName, function(error, data) {
      if (error) throw error;

      var filter = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].date >= startDate && data[i].date <= endDate && selectCategories.indexOf(data[i].category) != -1) {
          filter.push(data[i]);
        }
      }
      orderByCategory = d3.nest()
        .key(function(d){return d.category}).sortKeys(d3.ascending)
        .rollup(function(d){return d.length})
        .entries(filter)

      r.domain([0, data.length])
      arc.outerRadius(r(filter.length))

      mainPie.selectAll("path")
        .data(pie(orderByCategory))
        .enter()
        .append("path")
          .attr("d",arc)
          .attr("fill",function(d){return colorCategory(d.data.key)})
          .attr("opacity",0.5)
          //  .on("mouseover",function(){
          //    d3.select(this).attr("opacity",0.8)})
          //  .on("mouseout",function(){
          //    d3.select(this).attr("opacity",0.5)})     

  /* from display function

      for (var i = 0; i < categoryList.length; i++) {
        if ( selectCategories.indexOf(categoryList[i]) == -1) {
          orderByCategory[i].values = 0;
        }
      }

      mainPie.selectAll(".arc")
          .data(pie(orderByCategory))
        .enter()
        .append("g")
          .attr("class","arc")
        .append("path")
          .attr("d",arc)
          .attr("fill",function(d){return colorCategory(d.data.key)})
          .attr("opacity",0.5) 
      //mainPie.selectAll(".arc").append("text")
      //  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      //  .attr("dy", ".35em")
      //  .text(function(d) { return d.data.values; });
  */
  })
}

// Filters articles and calls displayList function to display results
function filterArticles() {
  console.log("hello")
    d3.json(fileName, function(error, data) {
        if (error) throw error;

        var sorted = [];
        for (var i = 0; i < data.length; i++) {
          console.log(selectDepts)
            if (data[i].date >= startDate && data[i].date <= endDate && selectCategories.indexOf(data[i].category) != -1) {
              sorted.push(data[i]);
            }
        }
        displayList(sorted);
    })
}


// Displays results of arr in the list of articles sidebar
function displayList(arr) {
    resetListResults();
  
    // sorts data by date so that most recent comes first
    arr.sort(function(a,b){
      // Turn your strings into dates, and then subtract them to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });  

    d3.select("#listArticles")
      .select("h3")
      .text(arr.length + " RESULTS")

    for (var i = 0; i < arr.length; i++)
    {
        /*
        d3.select("#listResults")
          .append("div")
          .style("padding", "5px")
          .style("position", "relative")
          .style("height", "auto")
          .style("border-bottom", "2px solid black")
          .attr("class", "result")
          .text(createArticle(data[i]));
        */
        createArticle(arr[i]);
    }
}

// Creates div in list of results that shows article information
// also manages the "more information" for each article
function createArticle(dataObj) {
    var typeColor = colors[allCategories.indexOf(dataObj.category)];
    var deptColor = colors[allDepts.indexOf(dataObj.dept)];
    var keywords = getKeywords(dataObj, 5, 2);
    var keywordOverv = getKeywordOverview(keywords);
    var mainKeywords = getKeywordString(keywords);
    var allKeywords = getKeywordString(getKeywords(dataObj, 4, 0));

    var result = d3.select("#listResults").append("div")
        .attr("class", "result")

    if (dataObj.category == "ThesisDefense") { 
      result.append("h4").text(String(dataObj.name).toLowerCase());
    } else {
      result.append("h4").text(dataObj.name);
    }

    // Date
    result.append("p")
      .text(moment(dataObj.date).format("YYYY-MM-DD"))
      .style("display", "inline")

    // Category Symbol
    result.append("h3")
      .text(dataObj.category.substring(0,1))
      .style("background-color", typeColor)

    // Department
    result.append("h3")
      .text(dataObj.dept)
      .style("background-color", deptColor)

    // Keywords
    result.append("p")
      .text(keywordOverv)
      .style("font-size", "16px")

    // More Information
    result.on("mouseover", function() {
      d3.select("#resultInfo").selectAll("div").remove();
      var info = d3.select("#resultInfo").append("div")
      info.append("h4").text(dataObj.name)    
      info.append("p").text("Date Posted: " + moment(dataObj.date).format("YYYY-MM-DD"))
      info.append("p").text("Category: " + dataObj.category)
      info.append("p").text("Department: " + dataObj.dept)
      info.append("p").text("Length of Article (in words): " + dataObj.lenArticle)
      //info.append("p").text("More Keywords: " + mainKeywords)
      info.append("p").text("All Keywords: " + allKeywords);
    })
}

// Clears list of article results
function resetListResults() {
  d3.select("#listResults")
    .selectAll("div").remove();
}

// Gets main keywords -- requirements on minimum word length and frequency
function getKeywords(dataObj, minWordLen, minFreq) {
    var fdist = dataObj.fdist;
    var keywords = [];
    for (var i = 0; i < fdist.length; i++) {
      if (fdist[i][1] >= minFreq && fdist[i][0].length >= minWordLen) 
      {
        if ( fdist[i][0]!= "Prof.")
          keywords.push(fdist[i][0]);   
      }
    }
    return keywords;
}

// turns array of keywords into string of words separated by comma and space
function getKeywordString(arr) {
  if (arr.length == 0) {return "Not Enough Keywords";}
  var str = "";
  for(var i = 0; i < arr.length; i++) {str += arr[i] + ", "}
  return str.substring(0, str.length - 2);
}

// Gets the first three keywords from getKeywords()
function getKeywordOverview(arr) {
    if (arr.length > 2) {
      arr = arr.slice(0, 3);
    } else {
      return "Not Enough Keywords";
    }
    var str = arr[0];
    for (var i = 1; i < arr.length; i++) { str += ", " + arr[i]}
    return str;
}

// Searches for and displays all articles with the search input in the title
function searchList() {
  var searchTerm = document.getElementById("searchInput").value.toLowerCase();
  console.log(searchTerm);

  d3.json(fileName, function(error, data) {
    if (error) throw error;

    var results = [];

    for (var i = 0; i < data.length; i++) {
      if (data[i].date >= startDate && data[i].date <= endDate && selectCategories.indexOf(data[i].category) != -1) {
          var title = data[i].name[0].toLowerCase();
          if (title.indexOf(searchTerm) != -1) { 
            results.push(data[i]); 
            console.log(data[i]);
            continue;
          } 

          var keywords = getKeywordString(getKeywords(data[i], 4, 0)).toLowerCase();
          if (keywords.indexOf(searchTerm) != -1) {
            results.push(data[i]);
            console.log(data[i])
          }

      }

    }
    displayList(results);
  })
}

