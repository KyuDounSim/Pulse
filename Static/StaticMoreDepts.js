/*
  Finally got data from multiple departments
  Code takes into account varying/missing attributes from data.
  Created August 9, 2016
  Last Edit: August 9, 2016
*/

/*{"dept": "CSE", "lenArticle": 3, "category": "News", "date": "2016-08-01", "name": "Title of the Article in Bold", "fdist": [["keywords", 10], ["appear", 8], ["here", 7]]},*/

var width = 960,
    height = 300,
    height2=20, 
    margin=50;
var selectCategories = [];
var selectDepts = [];
var categoryList, colorCategory;
var deptList, colorDept;
var earliestDate = "2002-07-09";
var latestDate = "2016-08-02";
var distinguishBar = "dept";
var distinguishPie = "category";

// Default Variable Values

var fileName = "allArticles.json"
var colorsForCategories = ['#5fc5aa','#f084ac','#5a92f2','#ffa345','#b640f1','#808080'];
var allCategories = ["Achievement", "Event", "News", "Seminar", "ThesisDefense"];

//var fileName = "allArticlesNoAchievements.json";
//var colorsForCategories = ['#f084ac','#5a92f2','#ffa345','#b640f1','#808080'];
//var allCategories = ["Event", "News", "Seminar", "ThesisDefense"];


var step=1.2;
var timeSelector= "month";
var allDepts = ["CBME","CEE", "CSE", "ECE", "IELM", "MAE"];
var colorsForDepts = ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f']
var startDate = earliestDate;
var endDate = latestDate;
var selectCategories = allCategories;
var selectDepts = allDepts;

    // each category corresponds to a color
    colorCategory = d3.scale.ordinal()
      .domain(allCategories)
      .range(colorsForCategories);
    colorDept = d3.scale.ordinal()
      .domain(allDepts)
      .range(colorsForDepts);


// Time Parser
var parseDate = d3.time.format("%Y-%m-%d").parse;

var barSVG = d3.select("body").append("svg")
    .attr("width", width + 2 * margin)
    .attr("height", height + 4 * 3*margin + 2 * height2)
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
displayBarBy(distinguishBar);
filterArticles();

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

    //earliestDate = moment(orderByDate[0].key).format("YYYY-MM-DD")
    //latestDate = moment(orderByDate[orderByDate.length - 1].key).format("YYYY-MM-DD")

    // reorder data by Date and then by Category
      // array of objects where "key" is the date and "values" is another array of objects where "key" is the date and "values" is the number of articles
    var orderByDateByCategory = d3.nest()
        .key(function(d){return d.date}).sortKeys(d3.ascending)
        .key(function(d){return d.category}).sortKeys(d3.ascending)
        .rollup(function(leaves){return leaves.length;})
        .entries(data);

    // for the purpose of distinguishing filtering out departments when categorizing by category
    var orderByDateByCategoryByDept = d3.nest()
        .key(function(d){return d.date}).sortKeys(d3.ascending)
        .key(function(d){return d.category}).sortKeys(d3.ascending)
        .key(function(d){return d.dept}).sortKeys(d3.ascending)
        .rollup(function(d){return d.length;})
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
        var category = orderByDateByCategoryByDept[i].values;
        for (var n = 0; n <= category.length - 1; n++) {
            switch(category[n].key) {
              case "News":
                if (selectCategories.indexOf("News") == -1) {
                  numNews[i] = 0;
                } else {
                  var sum = 0;
                  for (var j = 0; j < category[n].values.length; j++) {
                    if (selectDepts.indexOf(category[n].values[j].key) != -1) {
                      sum += category[n].values[j].values;
                    }
                  }
                  numNews[i]=sum;
                }
              break;

              case "Achievement":
                if (selectCategories.indexOf("Achievement") == -1) {
                  numAchievement[i] = 0;
                } else {
                  var sum = 0;
                  for (var j = 0; j < category[n].values.length; j++) {
                    if (selectDepts.indexOf(category[n].values[j].key) != -1) {
                      sum += category[n].values[j].values;
                    }
                  }
                  numAchievement[i]=sum;
                }
              break;

              case "Event":
                if (selectCategories.indexOf("Event") == -1) {
                  numEvent[i] = 0;
                } else {
                  var sum = 0;
                  for (var j = 0; j < category[n].values.length; j++) {
                    if (selectDepts.indexOf(category[n].values[j].key) != -1) {
                      sum += category[n].values[j].values;
                    }
                  }
                  numEvent[i]=sum;
                }
              break;

              case "ThesisDefense":
                if (selectCategories.indexOf("ThesisDefense") == -1) {
                  numThesis[i] = 0;
                } else {
                  var sum = 0;
                  for (var j = 0; j < category[n].values.length; j++) {
                    if (selectDepts.indexOf(category[n].values[j].key) != -1) {
                      sum += category[n].values[j].values;
                    }
                  }
                  numThesis[i]=sum;
                }
              break;

              case "Seminar":
                if (selectCategories.indexOf("Seminar") == -1) {
                  numSeminar[i] = 0;
                } else {
                  var sum = 0;
                  for (var j = 0; j < category[n].values.length; j++) {
                    if (selectDepts.indexOf(category[n].values[j].key) != -1) {
                      sum += category[n].values[j].values;
                    }
                  }
                  numSeminar[i]=sum;
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
      .range(colorsForCategories);

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
      .attr("opacity",1);

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
        .attr("width",(xF(layers[0][1].x)-xF(layers[0][0].x))/step)
        .on("dblclick", function(d) {
          var start, end;
          if (timeSelector == "day") {
              start = d.x;
              end = start;
          } else if (timeSelector == "week") {
              start = d3.time.week.floor(d.x);
              end = d3.time.week.ceil(d.x);
          } else if (timeSelector == "month") {
              start = d3.time.month.floor(d.x);
              end = d3.time.month.ceil(d.x);
          } else if (timeSelector == "year") {
              start = d3.time.year.floor(d.x);
              end = d3.time.year.ceil(d.x);
          }
          start = moment(start).format("YYYY-MM-DD");
          end = moment(end).format("YYYY-MM-DD")

          var sorted = [];
          for (var i = 0; i < data.length; i++) {
            if (data[i].date >= start && data[i].date <= end && selectCategories.indexOf(data[i].category) != -1 && selectDepts.indexOf(data[i].dept) != -1) {
              sorted.push(data[i]);
            }
          }
          displayList(sorted);
          window.alert("A bar was clicked.  All articles posted from " + start + " to " + end + " will be shown in the Articles sidebar.");
        })
  // END BAR CHART

    drawAxes();
    //displayList(data);
    displayPieBy(distinguishPie);

  });
// end of json function
}

function displayByDept() {
  d3.json(fileName,function(error,data) {
    if (error) throw error;

    // Reorder the data by Category
      // value is an array of objects where "key" is the category and "values" is the number of articles in that category
    var orderByDept = d3.nest()
        .key(function(d){return d.dept}).sortKeys(d3.ascending)
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
    var orderByDateByDept = d3.nest()
        .key(function(d){return d.date}).sortKeys(d3.ascending)
        .key(function(d){return d.dept}).sortKeys(d3.ascending)
        .rollup(function(leaves){return leaves.length;})
        .entries(data);

    // for the purpose of filtering out categories when categorizing by department
    var orderByDateByDeptByCategory = d3.nest()
        .key(function(d){return d.date}).sortKeys(d3.ascending)
        .key(function(d){return d.dept}).sortKeys(d3.ascending)
        .key(function(d){return d.category}).sortKeys(d3.ascending)
        .rollup(function(d){return d.length;})
        .entries(data);

    // creates array of category types
    deptList = d3.set(orderByDept.map(function(d){return d.key})).values().sort(d3.ascending);
    //allCategories = categoryList;

    // Map data based on DAY
    var numCBME = d3.range(orderByDate.length).map(function(){return 0});
    var numCEE = d3.range(orderByDate.length).map(function(){return 0});
    var numCSE = d3.range(orderByDate.length).map(function(){return 0});
    var numECE = d3.range(orderByDate.length).map(function(){return 0});
    var numIELM = d3.range(orderByDate.length).map(function(){return 0})
    var numMAE = d3.range(orderByDate.length).map(function(){return 0})

    var dayNode = d3.range(orderByDate.length).map(function(d,i) {
        var dept = orderByDateByDeptByCategory[i].values;
        for (var n = 0; n <= dept.length - 1; n++) {
            switch(dept[n].key) {
              case "CBME":
                if (selectDepts.indexOf("CBME") == -1) {
                  numCBME[i] = 0;
                } else {
                  var sum = 0;
                  for (var j = 0; j < dept[n].values.length; j++) {
                    if (selectCategories.indexOf(dept[n].values[j].key) != -1) {
                      sum += dept[n].values[j].values;
                    }
                  }
                  numCBME[i]=sum;
                }
              break;

              case "CEE":
                if (selectDepts.indexOf("CEE") == -1) {
                  numCEE[i] = 0;
                } else {
                  var sum = 0;
                  for (var j = 0; j < dept[n].values.length; j++) {
                    if (selectCategories.indexOf(dept[n].values[j].key) != -1) {
                      sum += dept[n].values[j].values;
                    }
                  }
                  numCEE[i]=sum;
                }
              break;

              case "CSE":
                if (selectDepts.indexOf("CSE") == -1) {
                  numCSE[i] = 0;
                } else {
                  var sum = 0;
                  for (var j = 0; j < dept[n].values.length; j++) {
                    if (selectCategories.indexOf(dept[n].values[j].key) != -1) {
                      sum += dept[n].values[j].values;
                    }
                  }
                  numCSE[i]=sum;
                }
              break;

              case "ECE":
                if (selectDepts.indexOf("ECE") == -1) {
                  numECE[i] = 0;
                } else {
                  var sum = 0;
                  for (var j = 0; j < dept[n].values.length; j++) {
                    if (selectCategories.indexOf(dept[n].values[j].key) != -1) {
                      sum += dept[n].values[j].values;
                    }
                  }
                  numECE[i]=sum;
                }
              break;

              case "IELM":
                if (selectDepts.indexOf("IELM") == -1) {
                  numIELM[i] = 0;
                } else {
                  var sum = 0;
                  for (var j = 0; j < dept[n].values.length; j++) {
                    if (selectCategories.indexOf(dept[n].values[j].key) != -1) {
                      sum += dept[n].values[j].values;
                    }
                  }
                  numIELM[i]=sum;
                }
              break;

              case "MAE":
                if (selectDepts.indexOf("MAE") == -1) {
                  numMAE[i] = 0;
                } else {
                  var sum = 0;
                  for (var j = 0; j < dept[n].values.length; j++) {
                    if (selectCategories.indexOf(dept[n].values[j].key) != -1) {
                      sum += dept[n].values[j].values;
                    }
                  }
                  numMAE[i]=sum;
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
          CBME:numCBME[i],
          CEE:numCEE[i],
          CSE:numCSE[i],
          ECE:numECE[i],
          IELM:numIELM[i],
          MAE:numMAE[i]
        }
    })

    // Creates Nodes for day, week, month, year
    function createNode(timePeriod) {
      var Node = d3.nest()
          .key(function(d){return d[timePeriod]})
          //.sortKeys(d3.ascending)
          .rollup(function(leaves) {
            return {
              "CBME":d3.sum(leaves,function(d){return d.CBME;}),
              "CEE":d3.sum(leaves,function(d){return d.CEE;}),
              "CSE":d3.sum(leaves,function(d){return d.CSE;}),
              "ECE":d3.sum(leaves,function(d){return d.ECE;}),
              "IELM":d3.sum(leaves,function(d){return d.IELM;}),
              "MAE":d3.sum(leaves,function(d){return d.MAE;}),
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
          CBME: c.CBME,
          CEE: c.CEE,
          CSE: c.CSE,
          ECE: c.ECE,
          IELM: c.IELM,
          MAE: c.MAE
        }
    })

    // Map the data based on MONTH
    var monthNode = createNode("month");
    monthNode = monthNode.map(function(d) {
      var c = d.values;
        return {
          date: parseDate(moment(orderByDate[0].key,"YYYY-MM-DD").add(d.key,"month").format("YYYY-MM-DD")),
          CBME: c.CBME,
          CEE: c.CEE,
          CSE: c.CSE,
          ECE: c.ECE,
          IELM: c.IELM,
          MAE: c.MAE
        }
    })

    // Map the data based on YEAR
    var yearNode = createNode("year");
    yearNode = yearNode.map(function(d) {
      var c = d.values;
        return {
          date: parseDate(moment(orderByDate[0].key,"YYYY-MM-DD").add(d.key,"year").format("YYYY-MM-DD")),
          CBME: c.CBME,
          CEE: c.CEE,
          CSE: c.CSE,
          ECE: c.ECE,
          IELM: c.IELM,
          MAE: c.MAE
        }
    })

    // each category corresponds to a color
    colorDept = d3.scale.ordinal()
      .domain(deptList)
      .range(colorsForDepts);

    // Draw Label        
    var labelBoxes = barSVG.selectAll(".label")
      .data(orderByDept)
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
          return colorDept(d.key);
      })
      .attr("opacity",1);

    var labelText = labelBoxes.append("text")
      .text(function(d) {
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

    var n = orderByDept.length,   // number of category
        m = dateNode.length ;  // number of samples per layer

    // Generate the stack layout
    stack = d3.layout.stack()//.offset("wiggle")

    layers = stack(deptList.map(function(c) {
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
        .style("fill", function(d,i){return colorDept(deptList[i])})
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
        .attr("width",(xF(layers[0][1].x)-xF(layers[0][0].x))/step)
        .attr("opacity",1)
        .on("dblclick", function(d) {
          var start, end;
          if (timeSelector == "day") {
              start = d.x;
              end = start;
          } else if (timeSelector == "week") {
              start = d3.time.week.floor(d.x);
              end = d3.time.week.ceil(d.x);
          } else if (timeSelector == "month") {
              start = d3.time.month.floor(d.x);
              end = d3.time.month.ceil(d.x);
          } else if (timeSelector == "year") {
              start = d3.time.year.floor(d.x);
              end = d3.time.year.ceil(d.x);
          }
          start = moment(start).format("YYYY-MM-DD");
          end = moment(end).format("YYYY-MM-DD")

          var sorted = [];
          for (var i = 0; i < data.length; i++) {
            if (data[i].date >= start && data[i].date <= end && selectCategories.indexOf(data[i].category) != -1 && selectDepts.indexOf(data[i].dept) != -1) {
              sorted.push(data[i]);
            }
          }
          displayList(sorted);
          window.alert("A bar was clicked.  All articles posted from " + start + " to " + end + " will be shown in the Articles sidebar.");
        })

  // END BAR CHART
    drawAxes();
    displayPieBy(distinguishPie);
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
    d3.selectAll('.label').remove();
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
    displayBarBy(distinguishBar)
    filterArticles();
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

  //Earliest Date: 2002-07-09 Latest Date: 2016-08-02
  document.getElementById("startMonth").options[parseInt(earliestDate.substring(5,7)) - 1].selected = true;
  document.getElementById("startDay").options[parseInt(earliestDate.substring(8, 10))-1].selected = true;
  var yearDif = parseInt(latestDate.substring(0, 4)) - parseInt(earliestDate.substring(0, 4));
  document.getElementById("startYear").options[yearDif].selected = true;

  document.getElementById("endMonth").options[parseInt(latestDate.substring(5,7)) - 1].selected = true;
  document.getElementById("endDay").options[parseInt(latestDate.substring(8, 10))-1].selected = true;
  document.getElementById("endYear").options[0].selected = true;

  document.getElementById("byCategory").checked = false;
  document.getElementById("byDept").checked = true;

  selectAllCategories();
  selectAllDepts();
  month();
  filterGo();
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
  
  if(document.getElementById("byCategory").checked) {
    distinguishBar = "category";
    document.getElementById("byDept").checked = false;
  }
  else if(document.getElementById("byDept").checked) {
    distinguishBar = "dept";
    document.getElementById("byCategory").checked = false;
  }

  if (document.getElementById("pieByCategory").checked) {
    distinguishPie = "category";
    document.getElementById("pieByDept").checked = false;
  }
  else if (document.getElementById("pieByDept").checked) {
    distinguishPie = "dept";
    document.getElementById("pieByCategory").checked = false;
  }

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
  filterArticles();
}

function filterBar() {
  mainPageBar.selectAll(".rect")
      .attr("x", function(d) { return xF(d.x); })
      .attr("y", function(d) { return y(d.y + d.y0); })
      .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
      .attr("width",(xF(layers[0][1].x)-xF(layers[0][0].x))/step);

  mainPageBar.select(".xFAxis").call(xFAxis);
}

function filterPieCategory() {
  mainPie.selectAll("path").remove()
  mainPie.selectAll(".label").remove()

  d3.json(fileName, function(error, data) {
      if (error) throw error;

      var filter = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].date >= startDate && data[i].date <= endDate && selectCategories.indexOf(data[i].category) != -1 && selectDepts.indexOf(data[i].dept) != -1) {
          filter.push(data[i]);
        }
      }
     
      orderByCategory = d3.nest()
        .key(function(d){return d.category}).sortKeys(d3.ascending)
        .rollup(function(d){return d.length})
        .entries(filter)
    /*
      orderByCategory = d3.nest()
        .key(function(d) {return d.category}).sortKeys(d3.ascending)
        .rollup(function(d) {
          return d3.sum(d, function(g) {return g.lenArticle; });
        }).entries(filter)
    */

      categoryList = d3.set(orderByCategory.map(function(d){return d.key})).values().sort(d3.ascending);

      colorCategory = d3.scale.ordinal()
              .domain(categoryList)
              .range(colorsForCategories);

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

    // Draw Label        
    var labelBoxes = pieSVG.selectAll(".label")
      .data(orderByCategory)
      .enter()
      .append("g")
      .attr("class","label");

    var labelRect = labelBoxes.append("rect")
      .attr("x",20)
      .attr("y",function(d,index) {
          return margin - 10 + index*20;
      })
      .attr("width",10)
      .attr("height",10)
      .attr("fill",function(d) {
          if(d == "Unknow") return "#999";
          return colorCategory(d.key);
      })
      .attr("opacity",0.5);
    var labelText = labelBoxes.append("text")
      .text(function(d) {
          if (d.key == "ThesisDefense") return "Thesis Defense";
          return d.key;
      })
      .style("fill","#666")
      .attr("x", 40)
      .attr("y",function(d,index) {
          return margin+index*20;
      });

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

function filterPieDept() {
  mainPie.selectAll("path").remove()
  mainPie.selectAll(".label").remove();

  d3.json(fileName, function(error, data) {
      if (error) throw error;

      var filter = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].date >= startDate && data[i].date <= endDate && selectCategories.indexOf(data[i].category) != -1 && selectDepts.indexOf(data[i].dept) != -1) {
          filter.push(data[i]);
        }
      }

      orderByDept = d3.nest()
        .key(function(d){return d.dept}).sortKeys(d3.ascending)
        .rollup(function(d){return d.length})
        .entries(filter)

      deptList = d3.set(orderByDept.map(function(d){return d.key})).values().sort(d3.ascending);

      colorDept = d3.scale.ordinal()
              .domain(deptList)
              .range(colorsForDepts);

      r.domain([0, data.length])
      arc.outerRadius(r(filter.length))
      
      mainPie.selectAll("path")
        .data(pie(orderByDept))
        .enter()
        .append("path")
          .attr("d",arc)
          .attr("fill",function(d){return colorDept(d.data.key)})
          .attr("opacity",0.5)

      // Draw Label        
      var labelBoxes = pieSVG.selectAll(".label")
        .data(orderByDept)
        .enter()
        .append("g")
        .attr("class","label");

      var labelRect = labelBoxes.append("rect")
        .attr("x",20)
        .attr("y",function(d,index) {
            return margin - 10 + index*20;
        })
        .attr("width",10)
        .attr("height",10)
        .attr("fill",function(d) {
            if(d == "Unknow") return "#999";
            return colorDept(d.key);
        })
        .attr("opacity",0.5);
      var labelText = labelBoxes.append("text")
        .text(function(d) {
            return d.key;
        })
        .style("fill","#666")
        .attr("x", 40)
        .attr("y",function(d,index) {
            return margin+index*20;
        });
  })
}

// Filters articles and calls displayList function to display results
function filterArticles() {
    d3.json(fileName, function(error, data) {
        if (error) throw error;
        var sorted = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].date >= startDate && data[i].date <= endDate && selectCategories.indexOf(data[i].category) != -1 && selectDepts.indexOf(data[i].dept) != -1) {
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
    //var typeColor = colorsForCategories[allCategories.indexOf(dataObj.category)];
    //var deptColor = colorsForDepts[allDepts.indexOf(dataObj.dept)];
    var typeColor = colorCategory(dataObj.category)
    var deptColor = colorDept(dataObj.dept)

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
      .style("border-radius", "0")


    var keywords, keywordOverv, mainKeywords, allKeywords
	  if (dataObj.dept == "CSE") {
	    keywords = getKeywords(dataObj, 5, 2);
	    keywordOverv = getKeywordOverview(keywords);
	    mainKeywords = getKeywordString(keywords);
	    allKeywords = getKeywordString(getKeywords(dataObj, 4, 0));

	    // Keywords
	    result.append("p")
	      .text(keywordOverv)
	      .style("font-size", "16px")
	  }


    // More Information
    result.on("mouseover", function() {
      d3.select("#resultInfo").selectAll("div").remove();
      var info = d3.select("#resultInfo").append("div")
        .attr("class", "moreInfo")
      info.append("h4").text(dataObj.name)    
      info.append("p").text("Date Posted: " + moment(dataObj.date).format("YYYY-MM-DD"))
      info.append("p").text("Category: " + dataObj.category)
      info.append("p").text("Department: " + dataObj.dept)

      if (dataObj.dept == "CSE") {
    	  info.append("p").text("Length of Article (in words): " + dataObj.lenArticle)
		    //info.append("p").text("More Keywords: " + mainKeywords)
		    info.append("p").text("All Keywords: " + allKeywords);
      } else if (dataObj.dept == "ECE") {
      	info.append("p").text("Content: " + dataObj.content);
      }

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

  d3.json(fileName, function(error, data) {
    if (error) throw error;

    var results = [];

    for (var i = 0; i < data.length; i++) {
      if (data[i].date >= startDate && data[i].date <= endDate && selectCategories.indexOf(data[i].category) != -1 && selectDepts.indexOf(data[i].dept) != -1) {
          var title;
          if (data[i].dept == "CSE") {
           title = data[i].name[0].toLowerCase();
           title += " " + getKeywordString(getKeywords(data[i], 4, 0)).toLowerCase();
         	}
          else if(data[i].dept == "ECE") {
           	title = data[i].name.toLowerCase();
           	title += " " + data[i].content;
          }
          if (title.indexOf(searchTerm) != -1) { 
            results.push(data[i]); 
            continue;
          } 
		/*
          var keywords = getKeywordString(getKeywords(data[i], 4, 0)).toLowerCase();
          if (keywords.indexOf(searchTerm) != -1) {
            results.push(data[i]);
          }
		*/
      }

    }
    displayList(results);
  })
}

function displayBarBy(distinguishBar) {
  if (distinguishBar == "dept") {
    displayByDept();
  } else if (distinguishBar == "category") {
    display();
  }
}

function displayPieBy(distinguishPie) {
  if (distinguishPie == "dept") {
    filterPieDept();
  } else if (distinguishPie == "category") {
    filterPieCategory();
  }
}
