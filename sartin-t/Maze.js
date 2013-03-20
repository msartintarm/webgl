
function Maze() {  
    //f b r l
    //meaning the order this data is pushed in is front, back, left, right wall.
    this.pieces = [];
    this.width = 5;
    this.height = 7;
 
    this.hellRoom = new MazePiece(NO_FRONT, HELL_TEXTURE).translate([20, 0, 20]);
    this.Piece(BACK_LEFT, BRICK_TEXTURE);
    this.Piece(NO_WALLS);
    this.Piece(FRONT_BACK, BRICK_TEXTURE);
    this.Piece(BACK, BRICK_TEXTURE);
    this.Piece(BACK_RIGHT, BRICK_TEXTURE);
    
    this.Piece(LEFT_RIGHT, BRICK_TEXTURE);
    this.Piece(RIGHT, BRICK_TEXTURE);
    this.Piece(FRONT_LEFT, BRICK_TEXTURE);
    this.Piece(RIGHT, BRICK_TEXTURE);
    this.Piece(RIGHT, BRICK_TEXTURE);

    this.Piece(LEFT_RIGHT, BRICK_TEXTURE);
    this.Piece(FRONT, BRICK_TEXTURE);
    this.Piece(RIGHT, BRICK_TEXTURE);
    this.Piece(RIGHT, BRICK_TEXTURE);
    this.Piece(RIGHT, BRICK_TEXTURE);

    this.Piece(LEFT, BRICK_TEXTURE);
    this.Piece(LEFT, BRICK_TEXTURE);
    this.Piece(FRONT, BRICK_TEXTURE);
    this.Piece(FRONT_LEFT, BRICK_TEXTURE);
    this.Piece(RIGHT, BRICK_TEXTURE);

    this.Piece(LEFT_RIGHT, FLOOR_TEXTURE);
    this.Piece(FRONT, FLOOR_TEXTURE);
    this.Piece(FRONT, FLOOR_TEXTURE);
    this.Piece(RIGHT,FLOOR_TEXTURE);
    this.Piece(FRONT_RIGHT, 
	       [WOOD_TEXTURE, FLOOR_TEXTURE]);

    this.Piece(FRONT_LEFT, FLOOR_TEXTURE);
    this.Piece(FRONT_BACK, FLOOR_TEXTURE);
    this.Piece(NO_LEFT, FLOOR_TEXTURE);
    this.Piece(RIGHT, FLOOR_TEXTURE);
    this.Piece(LEFT_RIGHT, FLOOR_TEXTURE);

    this.Piece(FRONT_LEFT, 
	       [FLOOR_TEXTURE, HEAVEN_TEXTURE]);
    this.Piece(FRONT, FLOOR_TEXTURE);
    this.Piece(FRONT, FLOOR_TEXTURE);
    this.Piece(FRONT, FLOOR_TEXTURE);
    this.Piece(FRONT_RIGHT, FLOOR_TEXTURE);

    this.transPieces();
}

Maze.prototype.initBuffers = function(gl_) {
    for(var i=0; i < this.pieces.length; ++i){
	this.pieces[i].initBuffers(gl_);
    }
    this.hellRoom.initBuffers(gl_);
}

Maze.prototype.Piece = function(a,b) {
    var newPiece = new MazePiece(a,b);
    this.pieces.push(newPiece);
    return newPiece;
}

// Based upon the piece number, translate it by its coords
Maze.prototype.transPieces = function() {
    var theWidth, theHeight;
    for(var i = 0; i < this.pieces.length; ++i) {
	theWidth = i % this.width;
	theHeight = (i - theWidth) / this.width;
	this.pieces[i].translate([theWidth * 20, 0, theHeight * -20]);
    }
}

Maze.prototype.draw = function(gl_,buffer_) {
    this.hellRoom.draw(gl_,buffer_);
    for(var i = 0; i<this.pieces.length; i++){
	this.pieces[i].draw(gl_, buffer_);
    }
}

var mazeDebug = false;

/**
 *  Remember: (0,0) is top left, (20 * Width, -20 * Height) is
 *  bottom right, in the xz plane
 * 
 *  This function returns false if position is illegal
 */
Maze.prototype.checkPosition = function() {
    var curPos, newPos, pieceX, pieceZ, curPiece, newPiece;
    curPos = theMatrix.getPosition();
    newPos = vec4.create();
    vec4.transformMat4(newPos, curPos, theMatrix.vMatrixNew);

    pieceX = Math.round(curPos[0] / 20);
    pieceZ = Math.round(curPos[2] /-20);
    curPiece = (this.width * pieceZ) + pieceX;
    pieceX = Math.round(newPos[0] / 20);
    pieceZ = Math.round(newPos[2] /-20);
    newPiece = (this.width * pieceZ) + pieceX;

    var piecePosX = newPos[0] % 20;
    var piecePosZ = newPos[2] % 20;

    if(mazeDebug== true) {
	var posStats = document.getElementById("positionCheckStats");
	posStats.style.display = "inline-block";
	posStats.innerHTML = "old position: " + 
	    parseFloat(curPos[0]).toFixed(2) + "," + 
	    parseFloat(curPos[1]).toFixed(2) + "," +  
	    parseFloat(curPos[2]).toFixed(2) +
	    "<br/>new position: " +
	    parseFloat(newPos[0]).toFixed(2) + "," + 
	    parseFloat(newPos[1]).toFixed(2) + "," +  
	    parseFloat(newPos[2]).toFixed(2);
	
	posStats.innerHTML += "<br/> Maze Piece: from " + 
	    curPiece +
	    " to " + newPiece + " with piece-local coords " +
	    parseFloat(piecePosX).toFixed(2) + "," +  
	    parseFloat(piecePosZ).toFixed(2);
	if(piecePosX > 10 && piecePosX < 12) posStats.innerHTML += 
	"<br/> Getting close to right wall..";
	else if(piecePosX > 8 && piecePosX < 10) posStats.innerHTML += 
	"<br/> Getting close to left wall..";
	if(piecePosZ < -10 && piecePosZ > -12) posStats.innerHTML += 
	"<br/> Getting close to top wall..";
	else if(piecePosZ < -8 && piecePosZ > -10) posStats.innerHTML += 
	"<br/> Getting close to bottom wall..";

	if((curPiece >= 0) && 
	   (!this.pieces[curPiece].positionLegal(newPos))) {
	    alert("Crossing illegal border..");
	    return false;
	}
    }
    return true;
}
