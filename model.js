"use strict";

function Board(xNum, yNum) { // class Board

	xNum = xNum || 7;
	yNum = yNum || 6;
	
	this.xNum = xNum;
	this.yNum = yNum;
	
	this.cells = [];
	for (var i=0; i<xNum; i++) {
		this.cells[i] = [];
		for (var j=0; j<yNum; j++) {
			this.cells[i][j] = {'val': 0, 'x': i, 'y': j}; // initialize cell values [col][row]
		}
	}
}

Board.prototype.inRange = function(x,y) {
	if ( x < 0 || y < 0 || x > xNum-1 || y > yNum-1 ) return false;
	else return true;
}

Board.prototype.test = function() { // initializes a test board
	var cells = [ [1,1,-1,0,0,0], [1,-1,1,0,0,0], [-1,1,-1,-1,0,0], [-1,1,1,0,0,0], [1,-1,-1,1,0,0], [-1,-1,-1,-1,0,0], [1,1,-1,1,0,0] ];
	for (var i=0; i<xNum; i++) {
		for (var j=0; j<yNum; j++) {
			this.cells[i][j].val = cells[i][j];
		}
	}
	return this;
}

Board.prototype.row = function(y) { // returns a row of cells
	var row = [];
	for (var i=0; i<this.xNum; i++) {
		row.push(this.cells[i][y-1].val);
	}
	return row;
}

Board.prototype.print = function() { // prints to console cells values
	for (var j=this.yNum; j>0; j--) {
		console.log(this.row(j).join("\t\t"));
	}
}

Board.prototype.emptyCell = function(col) { // returns the first empty cell in a column
	for (var j=0; j<this.yNum; j++) {
		if (this.cells[col][j].val === 0) return this.cells[col][j];
	}
	return null; 
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

Board.prototype.connect4 = function(cell) {
if ( this.inRow(cell,0,1) === 4 || this.inRow(cell,1,1) === 4 || this.inRow(cell,1,0) === 4 || this.inRow(cell,1,-1) === 4 ) return true;
else return false;
}