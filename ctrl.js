"use strict";

var 	model = new Board(),
		$holes = divBoard(model),
		$board = $("#board"),
		$top = $("#top"),
		player = 1,
		playHistory = [];
		
// 1. Initialize model - it will persist for the rest of the game
// 2. Initialize view: create all html elements and style them
// 3. Assign callback functions to each element in the controller
// 4. Connect functions with the model
		

$(document).ready(function() {
	setUpView(model);
	gameOn();
	$("#refresh").click(restart);
	$("#redo").click(takeBack);
});

function restart() {
	boardReset();
	model.reset();
	gameOn();
}

function updateCell(cell) {
	cell.val = player;
	playHistory.push(cell);
}

function takeBack() {
	if ( $("#playerB").val() === "2" ) recoverLastTwoCells();
	else recoverLastCell();
	$("#one").show();
}

function recoverLastTwoCells() {
	if (playHistory.length > 1) {
		var cell = playHistory[playHistory.length - 1];
		cell.val = 0;
		cell.div.children("img").remove();
		playHistory.pop();	
		cell = playHistory[playHistory.length - 1];
		cell.val = 0;
		cell.div.children("img").remove();
		playHistory.pop();
		$("#end").hide();
	}
}

function recoverLastCell() {
	if (playHistory.length > 0) {
		var cell = playHistory[playHistory.length - 1];
		cell.val = 0;
		cell.div.children("img").remove();
		togglePlayer();
		playHistory.pop();	
		$("#end").hide();
	}
}

function boardReset() { //remove coins
	while (playHistory.length > 0) {
		var cell = playHistory.pop();
		cell.div.children("img").remove();
	}
}

