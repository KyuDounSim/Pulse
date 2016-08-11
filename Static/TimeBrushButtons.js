/*
	JS for HTML Buttons with Time Brush
	Works for StaticBar.js, StaticTimeBrush.js
	Created July 25, 2016
	Last Edit: August 1, 2016
*/


countFilter = 0;
countArt = 0;

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

function selectAllCategories() {
	var allCategories = ["Achievement", "News", "Event", "Seminar", "ThesisDefense"];
	for (var i = 0; i < allCategories.length; i++) {
		document.getElementById(allCategories[i]).checked = true;
	}
}

var playPause = 0;
function buttonSign() {
	/*
	var button = document.getElementById("playButton")
    if (playPause % 2 == 0) { button.innerHTML = "&#10074;&#10074;"; } 
    else { button.innerHTML = "&#9658;";}
    */
    playPause++;
}
