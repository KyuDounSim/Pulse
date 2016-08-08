

// const width = 960,
//     height = 400,
//     height2=20,
//     widthT=700,
//     widthP=400,
//     minRadius=50,
//     maxRadius=140

//     margin=50;

var step=1.2;
// var duration=1000;

var svgRiver2 = d3.select("#themeRiver2").append("svg")
    .attr("width", widthT)
    .attr("height", height+height2+margin);


    svgRiver2.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);
        
var svgPie2=d3.select("#pie2").append("svg")
       .attr("width",widthP)
       .attr("height", height+height2+margin)

svgPie2.append("defs").append("clipPath")
  .attr("class","clip")
  .append("rect")
  .attr("width",width)
  .attr("height",height)

// var x = d3.scaleTime()
//     .range([0, widthT])


var parseDate = d3.timeParse("%Y-%m");

// var r=d3.scaleLinear()
//        .range([minRadius, maxRadius])

// var y = d3.scaleLinear()
//     .range([height, 0])
//     .nice();

// var xAxis = d3.axisBottom()
//     .scale(x)
//     .tickFormat(d3.timeFormat("%Y,%b"))
    
    

    
    

// var yAxis = d3.axisLeft()
//     .scale(y)
//     .tickSizeInner(-widthT);

var focus2 = svgRiver2
    .append("g")
    .attr("class","focus2")
    .attr("transform","translate("+margin+","+(height2)+")");

// var  stack = d3.stack().offset(d3.stackOffsetWiggle)
              

// var areaF = d3.area()
//     .curve(d3.curveBasis)
//     .x(function(d) {return x(d.data.date); })
//     .y0(function(d) {return y(d[0]); })
//     .y1(function(d) { return y(d[1]); });


//append a group in the svg for the pie chart
var pieGraph2=svgPie2.append("g")
    .attr("class","pie")
    .attr("transform","translate("+maxRadius+","+maxRadius+")")


//define pie layout

// var pie=d3.pie()
//     .value(function(d){return d.value})
//     .padAngle(0.02)
//     .sort(function(a,b){ return a.key.localeCompare(b.key)})

//an path generator for arc

// var arc=d3.arc()
//     .innerRadius(0)
var labelBox2=svgPie2.append("g")
    .attr("class","label")
    .attr("transform","translate("+(-maxRadius/5)+","+(maxRadius*1.3)+")")
// var brush=d3.brushX()
//           .extent([[0,0],[width,height2]]);

// var stopFlag=1;
// var transitionSpeed=25;
// var brushDomain
// var finalDomain

d3.json("cseAll.json",function(error,data){

if (error) throw error;


var categoryList2=d3.nest()
                .key(function(d){return d.category})
                .sortKeys(d3.ascending)
                .entries(data)
                .map(function(d){
                  return d.key
                })

var colorCategory2=d3.scaleOrdinal()
            .domain(categoryList2)
            .range(['#9bf2b4','#b153f2','#f27ca3','#f2e176','#5a92f2','#5fc5aa']);

var perMonth2=d3.nest()
           .key(function(d){
            return moment(d.date,"YYYY-MM-DD").format("YYYY-MM")
           })
           // .sortKeys(d3.ascending)
           // .key(function(d){
           //  return moment(d.date,"YYYY-MM-DD").format("MM")
           // })
           .sortKeys(d3.ascending)
           .key(function(d){
            return d.category
           })
           .sortKeys(d3.ascending)
           .rollup(function(leaves){
            return leaves.length
             })
           .entries(data)


var numberOfAchievement=d3.range(perMonth2.length).map(function(){return 0});
var numberOfEvent=d3.range(perMonth2.length).map(function(){return 0});
var numberOfNews=d3.range(perMonth2.length).map(function(){return 0});
var numberOfThesisDefence=d3.range(perMonth2.length).map(function(){return 0});
var numberOfSeminar=d3.range(perMonth2.length).map(function(){return 0})

var monthData2=perMonth2.map(function(d,i){
  for (var n = d.values.length - 1; n >= 0; n--) {
    switch(d.values[n].key)
    {
      case categoryList2[0]:
      numberOfAchievement[i]+=d.values[n].value
      break

      case categoryList2[1]:
      numberOfEvent[i]+=d.values[n].value
      break

      case categoryList2[2]:
      numberOfNews[i]+=d.values[n].value
      break

      case categoryList2[3]:
      numberOfSeminar[i]+=d.values[n].value
      break

      case categoryList2[4]:
      numberOfThesisDefence[i]+=d.values[n].value
      break

    }
  }
  return{
    date:parseDate(d.key),
    Achievement:numberOfAchievement[i],
    Event:numberOfEvent[i],
    News:numberOfNews[i],
    ThesisDefense:numberOfThesisDefence[i],
    Seminar:numberOfSeminar[i]

  }
})

var wholePeriod=moment(monthData2[monthData2.length-1].date,"YYYY-MM").year()*12+moment(monthData2[monthData2.length-1].date,"YYYY-MM").month()-moment(monthData2[0].date,"YYYY-MM").year()*12-moment(monthData2[0].date,"YYYY-MM").month()

// var monthDataNoGap=d3.range(wholePeriod).map(function(){return 0})
// var n=0
// for (var i = 0; i<wholePeriod;i--) 
// {  var time=moment(monthData2[0].date,"YYYY-MM").add(i,"month").format("YYYY-MM")
    
//     if (time==monthData2[n].date)
//         {monthDataNoGap[i]=monthData2[n];
//           n+=1;
//         }
//      else
//      monthDataNoGap[i]=({
//         date:time,
//         Achievement:0,
//         Event:0,
//         News:0,
//         Seminar:0,
//         ThesisDefense:0

//       }) 

//     }
// //
// //
// //
// // console.log(monthDataNoGap)

var riverData=d3.range(12).map(function(d,i){
return monthData2[i]
})

stack.keys(categoryList2)

var layers = stack(riverData);
var layersY=stack(monthData2)

// x.domain(d3.extent(layers[0].map(function(d) {return d.data.date })))

// y.domain([d3.min(layersY, function(layer) { return d3.min(layer, function(d) { return Math.min(d[0],d[1]); }); }), 
//   d3.max(layersY, function(layer) { return d3.max(layer, function(d) { return Math.max(d[0],d[1]); }); })*1.3])

// yAxis.ticks(y.domain()[1]-y.domain()[0]+1)

focus2.append("g")
  .attr("transform","translate(5,30)")
  .attr("class","background")
  .append("text")
  .text("CSE")
  .attr("opacity",0.3)

focus2.selectAll("path")
  .data(layers)
  .enter()
  .append("g")
  .append("path")
  .attr("class",function(d){return d.key})
  .attr("clip-path", "url(#clip)")
  .attr("id","areaF")
  .attr("d", areaF)
  .attr("fill",function(d,n){return colorCategory2(d.key)})
  .attr("opacity",0.6)
  .on("mouseover",function(){
      var selectedCategory=d3.select(this).attr("class");
      focus2.selectAll('.'+selectedCategory).attr("opacity",1);
      pieGraph2.selectAll('.'+selectedCategory).attr("opacity",1);
      labelBox2.selectAll("."+selectedCategory).attr("opacity",1);
      labelBox2.selectAll("."+selectedCategory).style("font-Size",23);
    })
    .on("mouseout",function(){
      var selectedCategory=d3.select(this).attr("class");
      focus2.selectAll('.'+selectedCategory).attr("opacity",0.6);
      pieGraph2.selectAll('.'+selectedCategory).attr("opacity",0.6);
       labelBox2.selectAll("."+selectedCategory).attr("opacity",0.6);
       labelBox2.selectAll("."+selectedCategory).style("font-Size",17);
    }) 
focus2.append("g")
      .attr("class", "yAxis")
      .attr("transform", "translate(0,0 )")
      .call(yAxis);

focus2.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0,"+(height+5)+" )")
      .call(xAxis);

var filter=[]
  
  for (var i =data.length - 1; i >= 0; i--) {

  if(parseDate(moment(data[i].date,"YYYY-MM-DD").format("YYYY-MM"))>x.domain()[0]&&
    parseDate(moment(data[i].date,"YYYY-MM-DD").format("YYYY-MM"))<x.domain()[1])
    filter.push(data[i]);
    }
 

  var reOrder=d3.nest()
                    .key(function(d){return d.category})
                    .rollup(function(d){return d.length})
                    .entries(filter)

r.domain([20,200])
arc.outerRadius(r(filter.length));

var orderByCategory=categoryList2.map(function(d,i){
    var n=0;
    for (var i = reOrder.length - 1; i >= 0; i--) {
      if(reOrder[i].key==d)
        {n+=reOrder[i].value;}
    }
    return{
        key:d,
        value:n
      }
  })

var piePath=pieGraph2.selectAll(".arc")
  .data(pie(orderByCategory))
  .enter()
  .append("g")
  .append("path")
  .attr("class",function(d){return d.data.key})
  .attr("d",arc)
  .each(function(d) { 
    this._current = d; })
  .attr("fill",function(d){return colorCategory2(d.data.key)})
  .attr("opacity",0.6)
  .on("mouseover",function(){
      var selectedCategory=d3.select(this).attr("class");
      focus2.selectAll('.'+selectedCategory).attr("opacity",1);
      pieGraph2.selectAll('.'+selectedCategory).attr("opacity",1);
      labelBox2.selectAll("."+selectedCategory).attr("opacity",1);
      labelBox2.selectAll("."+selectedCategory).style("font-Size",23);
    })
    .on("mouseout",function(){
      var selectedCategory=d3.select(this).attr("class");
      focus2.selectAll('.'+selectedCategory).attr("opacity",0.6);
      pieGraph2.selectAll('.'+selectedCategory).attr("opacity",0.6);
      labelBox2.selectAll("."+selectedCategory).attr("opacity",0.6);
      labelBox2.selectAll("."+selectedCategory).style("font-Size",17);
    }) 

  d3.select("#startTime").html(moment(x.domain()[0]).format("YYYY-MMM"));
    d3.select("#endTime").html(moment(x.domain()[1]).format("YYYY-MMM"));
    d3.select("#totalNumber").html("Total Number:"+filter.length);

var labelBoxes=labelBox2.selectAll("#labelBox2")
        .data(orderByCategory)
        .enter()
        .append("g")
        .attr("opacity",0.6)
        .attr("id","labelBox2")
        .attr("class",function(d){return d.key})
        .on("mouseover",function(){
          var selectedCategory=d3.select(this).attr("class");
          focus2.selectAll('.'+selectedCategory).attr("opacity",1);
          pieGraph2.selectAll('.'+selectedCategory).attr("opacity",1);

          labelBox2.selectAll("."+selectedCategory).attr("opacity",1);
          labelBox2.selectAll("."+selectedCategory).style("font-Size",23);
        })
        .on("mouseout",function(){
          var selectedCategory=d3.select(this).attr("class");
          focus2.selectAll('.'+selectedCategory).attr("opacity",0.6);
          pieGraph2.selectAll('.'+selectedCategory).attr("opacity",0.6);
           labelBox2.selectAll("."+selectedCategory).attr("opacity",0.6);
           labelBox2.selectAll("."+selectedCategory).style("font-Size",17);
        })  
;


var labelRect = labelBoxes.append("rect")
        .attr("rx",4)
        .attr("ry",4)
        .attr("x",20+margin)
        .attr("y",function(d,index){
            return margin+height2+15+index*30;
        })
        .attr("width",160)
        .attr("height",28)
        .attr("fill",function(d){
            if(d == "Unknow") return "#999";
            return colorCategory2(d.key);
        })
        

var labelCategory = labelBoxes.append("text")
        .text(function(d){
            return d.key;
        })
        .style("fill","#ffe")
        .attr("x", 30+margin)
        .attr("y",function(d,index){
            return margin+height2+35+index*30;
        })

var labelNumber=labelBoxes.append("text")
        .attr("class","labelNumber")
        .text(function(d){
            return d.value;
        })
        .style("fill","gray")
        .attr("x", 185+margin)
        .attr("y",function(d,index){
            return margin+height2+35+index*30;
        })

var totalNumber=labelBoxes.append("text")
        .attr("id","totalNumber")
        .attr("x",30+margin)
        .attr("y",margin+height2+35+(categoryList2.length)*30)

var n=0
var handle=0
handle=setInterval(function(){
  if(n<wholePeriod-12){
  transition();
 n++}
  else
  kill()},duration*1.1)

function kill(){
  clearInterval();
  handle=0;
}

function transition() {
riverData=d3.range(12).map(function(d,i){
return monthData2[i+n]})

layers = stack(riverData);

x.domain(d3.extent(layers[0].map(function(d) {return d.data.date })))

focus2.selectAll('.xAxis').remove()

focus2.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0,"+(height+5)+" )")
      .call(xAxis);


focus2.selectAll("path")
  .data(layers)
  .transition()
  .duration(duration)
  .ease(d3.easeLinear)
  .attr("d",areaF) 

filter=[]
  
  for (var i =data.length - 1; i >= 0; i--) {

  if(parseDate(moment(data[i].date,"YYYY-MM-DD").format("YYYY-MM"))>x.domain()[0]&&
    parseDate(moment(data[i].date,"YYYY-MM-DD").format("YYYY-MM"))<x.domain()[1])
    filter.push(data[i]);
    }
 

  var reOrder=d3.nest()
                    .key(function(d){return d.category})
                    .rollup(function(d){return d.length})
                    .entries(filter)

orderByCategory=categoryList2.map(function(d,i){
    var n=0;
    for (var i = reOrder.length - 1; i >= 0; i--) {
      if(reOrder[i].key==d)
        {n+=reOrder[i].value;}
    }
    return{
        key:d,
        value:n
      }
  })

// arc.outerRadius(r(filter.length))

// pieGraph2.selectAll("path")
//   .data(pie(orderByCategory))
//   .transition()
//   .duration(duration)
//   .ease(d3.easeLinear)
//   .attr("d",arc) 

piePath
.data(pie(orderByCategory))
.transition()
.duration(duration)
.ease(d3.easeLinear)
.attrTween("d",function (a) {
  
   var i = d3.interpolate(this._current, a);
    this._current=i(0)

    var k=d3.interpolate(arc.outerRadius()(),r(filter.length))
    return function(t) {
    return arc.outerRadius(k(t))(i(t));
  };
  
 })

d3.select("#startTime").html(moment(x.domain()[0]).format("YYYY-MMM"));
    d3.select("#endTime").html(moment(x.domain()[1]).format("YYYY-MMM"));
    d3.select("#totalNumber").html("Total Number:"+filter.length);

labelBoxes.selectAll(".labelNumber").remove()

    labelBoxes=labelBox2.selectAll("#labelBox2")
        .data(orderByCategory)

    labelNumber=labelBoxes.append("text")
        .attr("class","labelNumber")
        .text(function(d){
              return d.value;
        })
        .style("fill","gray")
        .attr("x", 185+margin)
        .attr("y",function(d,index){
            return margin+height2+35+index*30;
        })

}



});

