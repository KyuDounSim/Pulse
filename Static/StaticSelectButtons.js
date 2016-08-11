/*
	JS for HTML Buttons for Time Selection Codes
	Works with StaticTImeSelect.js, StaticDept.js, StaticDeptCategory.js, StaticMoreDepts.js
	Created: August 1, 2016
	Last Edit: Aug. 9, 2016
*/

countFilter = 0;
countArt = 0;
countNotes = 0;

function showfilterbar() {
	if (countFilter % 2 == 0) {
		document.getElementById("filterbar").style.left = "-160px";
		countFilter ++;
	}
	else {
		document.getElementById("filterbar").style.left = "0px";
		countFilter ++;
	}
}

function showarticlebar() {
	if (countArt % 2 == 0) {
		document.getElementById("listArticles").style.right = "-225px";
		countArt ++;
	}
	else {
		document.getElementById("listArticles").style.right = "0px";
		countArt ++;
	}
}

function showNotes() {
	if (countArt % 2 == 0) {
		document.getElementById("notes").style.display = "inline";
		countArt ++;
	}
	else {
		document.getElementById("notes").style.display = "none";
		countArt ++;
	}

}

function showHelp() {
      d3.select("#resultInfo").selectAll("div").remove();
      var help = d3.select("#resultInfo").append("div")
      help.append("p")
      	.text("FILTERS: Time Period Per Bar buttons declare how much time each bar stands for, i.e. either one day, one week, one month, or one year.")
      help.append("p").text("In Time frame, select the start and end dates, and the bar/pie chart and list of articles will update accordingly.\n Distinguishing by Category means that the bar chart will be stacked based on category.  In contrast, the pie chart will show the proportion by departments.  Vice versa, distinguishing by Department means that the colors in the bar graph will be for the departments, and the pie chart will show proportion by categories.Selecting or unselecting the items under Categories and Departments filters the data that is shown.")
      help.append("p").text("BAR GRAPH: Double clicking on one of the bars will show you the list of articles posted in during the time period represented by that bar.\n")
      help.append("p").text("LIST OF ARTICLES\nSearch: any articles where the title or keyword has the search term will show up.  The single character is the initial of the category the article is in.  The letters next to it is the abbreviation for the department the article was posted by.");
}

function selectAllCategories() {
	var allCategories = ["Achievement", "News", "Event", "Seminar", "ThesisDefense"];
	for (var i = 0; i < allCategories.length; i++) {
		document.getElementById(allCategories[i]).checked = true;
	}
}

function selectAllDepts() {
	var allDepts = ["CBME","CEE", "CSE", "ECE", "IELM", "MAE"];
	for (var i = 0; i < allDepts.length; i++) {
		document.getElementById(allDepts[i]).checked = true;
	}
}


var days = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var monthAbv = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

var startYear = d3.select("#startYear")
var endYear = d3.select("#endYear")
for (var i = 2016; i >= 2002; i--) {
	startYear.append("option")
		.attr("value", i)
		.text(i);
	endYear.append("option")
		.attr("value", i)
		.text(i);
}

var startMonth = d3.select("#startMonth")
var endMonth = d3.select("#endMonth")
for (var i = 1; i <= 12; i++) {
	var value = String(i);
	if (i < 10) { value = "0" + String(i); }
	startMonth.append("option")
		.attr("value", value)
		.text(monthAbv[i-1]);
	endMonth.append("option")
		.attr("value", value)
		.text(monthAbv[i-1]);
}


var startDay = d3.select("#startDay")
var endDay = d3.select("#endDay")
for (var i = 1; i <= 31; i++) {
	var value = String(i);
	if (i < 10) { value = "0" + String(i); }
	startDay.append("option")
		.attr("value", value)
		.text(value)
	endDay.append("option")
		.attr("value", value)
		.text(value)
}

var earliestDate = "2002-07-09";
var latestDate = "2016-08-02";
//Earliest Date: 2002-07-09 Latest Date: 2016-08-02
  document.getElementById("startMonth").options[parseInt(earliestDate.substring(5,7)) - 1].selected = true;
  document.getElementById("startDay").options[parseInt(earliestDate.substring(8, 10))-1].selected = true;
  var yearDif = parseInt(latestDate.substring(0, 4)) - parseInt(earliestDate.substring(0, 4));
  document.getElementById("startYear").options[yearDif].selected = true;

  document.getElementById("endMonth").options[parseInt(latestDate.substring(5,7)) - 1].selected = true;
  document.getElementById("endDay").options[parseInt(latestDate.substring(8, 10))-1].selected = true;
  document.getElementById("endYear").options[0].selected = true;

