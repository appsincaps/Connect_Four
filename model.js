"use strict";

function Board(x, y) { // class Board

	x = x || 7;
	y = y || 6;
	
	this.xNum = x;
	this.yNum = y;
	
	this.cells = [];
	for (var i=0; i<x; i++) {
		this.cells[i] = [];
		for (var j=0; j<y; j++) {
			this.cells[i][j] = {'val': 0, 'x': i, 'y': j}; // initialize cell values [col][row]
		}
	}
	
	this.history = [];
	this.turn = 1;
}

Board.prototype.reset = function() { // resets entire board
	for (var i=0; i<this.xNum; i++) {
		for (var j=0; j<this.yNum; j++) {
			this.cells[i][j].val = 0; // initialize cell values [col][row]
		}
	}
	this.history = [];
}

Board.prototype.makeMove = function(col) { // update board after a move
	var cell = this.emptyCell(col);
	if (cell != null) {
		cell.val = this.turn;
		this.turn *= -1;
		this.history.push(cell);
	}
}

Board.prototype.takeBack = function() { // take back last move
	if  (this.history.length > 0) {
		this.history.pop().val = 0;
	}
}

Board.prototype.inRange = function(x,y) { // check if indices in range
	if ( x < 0 || y < 0 || x > this.xNum-1 || y > this.yNum-1 ) return false;
	else return true;
}

Board.prototype.row = function(y) { // returns a row of cells
	var row = [];
	for (var i=0; i<this.xNum; i++) {
		row.push(this.cells[i][y-1].val);
	}
	return row;
}

Board.prototype.inRow = function(cell,x,y) { // checks how many coins in row in a given direction
	var val = cell.val,
			X = cell.x + x,
			Y = cell.y + y,
			num = 1;
			
	while ( this.inRange(X,Y) && this.cells[X][Y].val === val ) {
		num += 1;
		X += x;
		Y += y;
	}
	
	X = cell.x - x;
	Y = cell.y - y;
	
	while ( this.inRange(X,Y) && this.cells[X][Y].val === val ) {
		num += 1;
		X -= x;
		Y -= y;
	}	
	return num;
}

Board.prototype.inRowVal = function(cell,x,y,val) { // checks how many coins in row in a given direction
	var 	X = cell.x + x,
			Y = cell.y + y,
			num = 1;
			
	while ( this.inRange(X,Y) && this.cells[X][Y].val === val ) {
		num += 1;
		X += x;
		Y += y;
	}
	
	X = cell.x - x;
	Y = cell.y - y;
	
	while ( this.inRange(X,Y) && this.cells[X][Y].val === val ) {
		num += 1;
		X -= x;
		Y -= y;
	}	
	return num;
}

Board.prototype.connect4 = function(cell) { // check if four in row in any direction: (0,1) - vertical, (1,0) - horizontal and (1,1) and (1,-1) - both diagonals
if ( this.inRow(cell,0,1) > 3 || this.inRow(cell,1,1) > 3 || this.inRow(cell,1,0) > 3 || this.inRow(cell,1,-1) > 3 ) return true;
else return false;
}

// "Smarts" - code for making computer moves:

/*
General approach:
1. Find all possible moves: no more than 7
2. Find if any connects in four, if yes - this is the move, game over
3. Find all possible moves by opponent
4. Find if any connects in four, if so - this is the move
5. Rate all moves offensively:
6. Rate all moves defensively:
7. Choose move with highest score
*/
Board.prototype.nextMove = function() { // returns next best move
	var 	moves = this.moves(),
			val = this.turn,
			offenseRating = [],
			defenseRating = [],
			bestMove, bestRating;
	if ( moves.isEmpty ) return null;
	this.print();
	for ( var i in moves ) {
		offenseRating.push(this.rating(moves[i], val));
		defenseRating.push(this.rating(moves[i], -val));
	}
	console.log(offenseRating.join("   "));
	console.log(defenseRating.join("   "));
	for ( var i in offenseRating) { if (offenseRating[i] > 99 ) return moves[i]; }
	for ( var i in defenseRating) { if (defenseRating[i] > 99 ) return moves[i]; }
	var i = moves.length - 1;
	bestMove = moves[i];
	bestRating = offenseRating[i] + defenseRating[i];
	while (i--) {
		if ( (offenseRating[i] + defenseRating[i]) > bestRating ) {
			bestMove = moves[i];
			bestRating = offenseRating[i] + defenseRating[i];
		}
		//if ( (offenseRating[i] + defenseRating[i]) === bestRating && i === 3 )  bestMove = moves[i];
	}
	return bestMove;
}

Board.prototype.moves = function()  { // returns array of cells with possible moves for a given player
	var openCells = [];
	for (var i=0; i<this.xNum; i++) {
		var cell = this.emptyCell(i);
		if (cell != null) openCells.push(cell);
	}
	return openCells;
}

Board.prototype.emptyCell = function(col) { // returns the first empty cell in a column
	for (var j=0; j<this.yNum; j++) {
		if (this.cells[col][j].val === 0) return this.cells[col][j];
	}
	return null; 
}

Board.prototype.connectNum = function(cell,num,val) { // check if Num of coins in row in any direction: (0,1) - vertical, (1,0) - horizontal and (1,1) and (1,-1) - both diagonals
	var 	count = 0,
			dir = [[0,1], [1,1], [1,0], [1,-1]];

	for ( var i=0; i<4; i++ ) {
		if ( this.inRowVal(cell, dir[i][0], dir[i][1], val) === num ) count++;
	}
	return count;
}

Board.prototype.rating = function(cell,val) { // calculates total score for a given rating schedule
	var 	score = 0,
			ratings = [0, 1, 10, 100, 1000, 10000, 100000],
			dir = [[0,1], [1,1], [1,0], [1,-1]]; //4 direction vectors

	for ( var i=0; i<4; i++ ) {
		score += ratings[this.inRowVal(cell, dir[i][0], dir[i][1], val) - 1];
	}
	return score;
}

// Test functions:

Board.prototype.test = function() { // initializes a test board
	var cells = [ [1,1,-1,0,0,0], [-1,-1,1,0,0,0], [-1,1,-1,-1,0,0], [-1,1,1,0,0,0], [1,-1,-1,1,0,0], [-1,-1,-1,1,0,0], [1,1,-1,1,0,0] ];
	for (var i=0; i<this.xNum; i++) {
		for (var j=0; j<this.yNum; j++) {
			this.cells[i][j].val = cells[i][j];
		}
	}
	return this;
}

Board.prototype.print = function() { // prints to console cells values
	for (var j=this.yNum; j>0; j--) {
		console.log(this.row(j).join("\t\t"));
	}
}

