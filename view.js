"use strict";

var 	boardWidth = 420,
		xNum = 7,
		yNum = 6,
		size, inside, margin,
		player = 1,
		theme = "boardtheme_1",
		top_theme = "toptheme_1",
		$board = $("#board").empty(),
		$top = $("#top").empty(),
		model = new Board(xNum, yNum),
		$holes = divBoard(model),
		playHistory = [];
		
// draggable functions:

function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text/html", ev.target.id);
}

function drop(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text/html");
	ev.target.appendChild(document.getElementById(data));
	move(Number(ev.target.id));
}

function sizing() { // calculates cell sizes
	size = Math.round(boardWidth/xNum);
	inside = Math.round(0.4*size) * 2;
	margin = (size - inside) / 2;
}

function divBoard(mod) { // generates divs for a board and links them to cells
	var divs = [];
	for (var i=0; i<mod.xNum; i++) {
		divs[i] = [];
		for (var j=0; j<mod.yNum; j++) {
			divs[i][j] = $("<div>").addClass("hole empty");
			model.cells[i][j].div = divs[i][j];
		}
	}
	return divs;
}	

function fill(ver) { // fills in cell's divs with coins
	var $coin = $('<img>');
	if ( ver === 1 ) $coin.attr('src', 'images/red1.png');
	else $coin.attr('src', 'images/yellow1.png');
	$coin.attr('draggable', 'false');
	return $coin.width(inside).height(inside);
}

function dragCoin(ver) {
	var $coin = fill(ver);
	$coin.attr({
		'id': 'one',
		'draggable': 'true',
		'ondragstart': 'drag(event)'
	});
	return $coin;
}

function gameOn() {
	
	sizing();
	player = 1;
	$("#end").hide();
	$("#main").hide().width(size*xNum + 10);
	$board.empty().width(xNum*size).height(yNum*size).addClass(theme);
	$board.css("border-radius", "0px 0px " + size/2 + "px " + size/2 + "px");
	$top.empty().width(xNum*size).height(size).addClass(top_theme);
	$top.css("border-radius", size/2 + "px " + size/2 + "px " + "0px 0px");
	$("#left img").remove();
	$("#right img").remove();
	
	model = new Board(xNum, yNum);
	$holes = divBoard(model);

	for (var i=0; i<xNum; i++) {
		var $tops = $("<div>").addClass("hole empty").attr("id",i);
		$tops.attr({
			'ondrop': 'drop(event)',
			'ondragover': 'allowDrop(event)'
		});
		$top.append($tops); 
	}
	
	for (var j=yNum-1; j>=0; j--) {
		for (var i=0; i<xNum; i++) {
			$board.append($holes[i][j]); 
		}
	}
	
	$(".hole").width(inside).height(inside).css("margin", margin);
	$("#left").append(dragCoin(1));
	$("#main").fadeIn(1000);
	
	// events:
	
}

function move(col) {
	var cell = model.emptyCell(col);
	if ( cell.y === yNum-1 ) $("#"+col).attr({
			'ondrop': '{return false;}',
			'ondragover': '{return false;}'
		});
	dropEffect(col,cell.y);
	updateCell(cell);
	if ( model.connect4(cell) ) gameOver();
	else togglePlayer();
}

function togglePlayer() {
	$("#one").remove();
	player = player === 1 ? 2 : 1;
	if ( player === 1 ) $("#left").append(dragCoin(player));
	else $("#right").append(dragCoin(player));
}

function gameOver() {
	$("#end").show();
}

function dropEffect(col, row) {
	var 	timer,
			i = yNum,
			$coin = fill(player);
	timer = setInterval(function() { 
		if (i>row) {
			i--; model.cells[col][i].div.append($coin);
		}
		else clearInterval(timer);
	}, 50);
}

function updateCell(cell) {
	cell.val = player;
	playHistory.push(cell);
}

function recoverLastCell() {
	if (playHistory.length > 0) {
		var cell = playHistory[playHistory.length - 1];
		cell.val = 0;
		cell.div.children("img").remove();
		togglePlayer();
		playHistory.pop();	
	}

}

$(document).ready(function() {
	gameOn();
	$("#refresh").click(gameOn);
	$("#redo").click(recoverLastCell);
});