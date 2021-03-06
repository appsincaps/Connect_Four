"use strict";

var 	boardWidth = 420,
		size, inside, margin, xNum, yNum,
		theme = "boardtheme_1",
		top_theme = "toptheme_1";

function divBoard(mod) { // generates divs for a board model and links them to cells
	var divs = [];
	for (var i=0; i<mod.xNum; i++) {
		divs[i] = [];
		for (var j=0; j<mod.yNum; j++) {
			divs[i][j] = $("<div>").addClass("hole empty");
			mod.cells[i][j].div = divs[i][j];
		}
	}
	return divs;
}	

// Setup functions

function setUpView(mod) { // sets up sizes and board's html elements
	
	xNum = mod.xNum;
	yNum = mod.yNum;
	
	// Sizing main elements:
	size = Math.round(boardWidth/xNum);
	inside = Math.round(0.4*size) * 2;
	margin = (size - inside) / 2;

	$("#main").hide().width(size*xNum + 10);
	$board.width(xNum*size).height(yNum*size).addClass(theme);
	$board.css("border-radius", "0px 0px " + size/2 + "px " + size/2 + "px");
	$top.width(xNum*size).height(size).addClass(top_theme);
	$top.css("border-radius", size/2 + "px " + size/2 + "px " + "0px 0px");
	

	// Attaching all "holes" to main elements
	for (var i=0; i<xNum; i++) {
		var $tops = $("<div>").addClass("hole empty").attr("id",i);
		$tops.attr({
			'ondrop': 'drop(event)',
			'ondragover': 'allowDrop(event)'
		});
		$top.append($tops); 
	}
	// using holes from controller
	for (var j=yNum-1; j>=0; j--) {
		for (var i=0; i<xNum; i++) {
			$board.append($holes[i][j]); 
		}
	}
	$(".hole").width(inside).height(inside).css("margin", margin);	
}

function gameOn() { // (re)starting point

	player = 1;
	$("#end").hide();
	$("#main").hide();
	$("#left img").remove();
	$("#right img").remove();
	$("#left").append(dragCoin(player));
	$("#main").fadeIn(1000);
}

function togglePlayer() {
	$("#one").remove();
	player = -player;
	if ( player === 1 ) $("#left").append(dragCoin(player));
	else {
		$("#right").append(dragCoin(player));
		if ( $("#playerB").val() === "2") setTimeout(computerMove, 1000);
	}
}

function computerMove() {
	var cell = model.nextMove();
	move(cell.x);
}

function gameOver() { // shows "Game Over" frame
	togglePlayer();
	$("#one").hide();
	setTimeout(function() { $("#end").show() }, 500);
}

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

function dragCoin(ver) {
	var $coin = fill(ver);
	$coin.attr({
		'id': 'one',
		'draggable': 'true',
		'ondragstart': 'drag(event)'
	});
	return $coin;
}

function fill(ver) { // fills in cell's divs with coins
	var $coin = $('<img>');
	if ( ver === 1 ) $coin.attr('src', 'images/red1.png');
	else $coin.attr('src', 'images/yellow1.png');
	$coin.attr('draggable', 'false');
	return $coin.width(inside).height(inside);
}

function dropEffect(col, row) { // effect of a dropping coin, change interval to speed up or slow down
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
