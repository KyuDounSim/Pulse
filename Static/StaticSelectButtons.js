/*
	JS for HTML Buttons for Time Selection Codes
	Works with StaticTImeSelect.js, StaticDept.js, StaticDeptCategory.js
	Last Edit: Aug. 4, 2016
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


//Earliest Date: 2002-07-09 Latest Date: 2016-07-14
document.getElementById("startMonth").options[6].selected = true;
document.getElementById("startDay").options[8].selected = true;
document.getElementById("startYear").options[14].selected = true;

document.getElementById("endMonth").options[6].selected = true;
document.getElementById("endDay").options[13].selected = true;
document.getElementById("endYear").options[0].selected = true;

