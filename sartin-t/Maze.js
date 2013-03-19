
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
    for(var i = 0; i < this.pieces.length; ++i) {
	var theWidth = i % this.width;
	var theHeight = (i - theWidth) / this.width;
	this.pieces[i].translate([theWidth * 20, 0, theHeight * -20]);
    }
}

Maze.prototype.draw = function(gl_,buffer_) {
    this.hellRoom.draw(gl_,buffer_);
    for(var i = 0; i<this.pieces.length; i++){
	this.pieces[i].draw(gl_, buffer_);
    }
}

/**
 *  Remember: (0,0) is top left, (20 * Width, -20 * Height) is
 *  bottom right, in the xz plane
 */
Maze.prototype.checkPosition = function() {
    var curPos = theMatrix.getPosition();
    var newPos = vec4.create();
    vec4.transformMat4(newPos, curPos, theMatrix.vMatrixNew);

    var pieceX = Math.round(curPos[0] / 20);
    var pieceZ = Math.round(curPos[2] /-20);
    var curPiece = (this.width * pieceZ) + pieceX;
    pieceX = Math.round(newPos[0] / 20);
    pieceZ = Math.round(newPos[2] /-20);
    var newPiece = (this.width * pieceZ) + pieceX;
    if(1 == 1) {
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
	    " to " + newPiece;
	
    }
    return 0;
}

Maze.prototype.getBound = function(pos) {
    //check to see if you are violating bound
    //and within the square
    for(var i=0; i<this.pieces.length; i++){
	if(pos[0] > (this.pieces[i].nX_bound-3) &&
	   pos[0] < (this.pieces[i].pX_bound+3) && 
	   pos[2] > (this.pieces[i].nZ_bound-3) &&
	   pos[2] < (this.pieces[i].pZ_bound+3)){
	    if(this.pieces[i].pZ_bound < pos[2] || 
	       this.pieces[i].nZ_bound > pos[2]){
		console.log('i : %d', i);
		return 1;
	    }
	    if(this.pieces[i].pX_bound < pos[0] || 
	       this.pieces[i].nX_bound > pos[0]){
		return 1; 
	    }     
	}
	//in the square and no violations, no problem
	else return 0;
    }
    return 0;
}
