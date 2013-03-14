function Maze() { 
    //f b r l
    this.pieces = {};
 
    this.pieces[0] = new MazePiece(0,1,0,1,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[1] = new MazePiece(0,1,0,0,brickTexture,hellTexture,brickTexture,brickTexture);
    this.pieces[2] = new MazePiece(1,1,0,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[3] = new MazePiece(0,1,0,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[4] = new MazePiece(0,1,1,0,brickTexture,brickTexture,brickTexture,brickTexture);
    
    this.pieces[5] = new MazePiece(0,0,1,1,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[6] = new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[7] = new MazePiece(1,0,0,1,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[8] = new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[9] = new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);

    this.pieces[10] = new MazePiece(0,0,1,1,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[11] = new MazePiece(1,0,0,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[12] = new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[13] = new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[14] = new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);

    this.pieces[15] = new MazePiece(0,0,0,1,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[16] = new MazePiece(0,0,0,1,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[17] = new MazePiece(1,0,0,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[18] = new MazePiece(1,0,0,1,brickTexture,brickTexture,brickTexture,brickTexture);
    this.pieces[19] = new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);

    this.pieces[20] = new MazePiece(0,0,1,1,floorTexture,floorTexture,floorTexture,floorTexture);
    this.pieces[21] = new MazePiece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.pieces[22] = new MazePiece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.pieces[23] = new MazePiece(0,0,1,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.pieces[24] = new MazePiece(1,0,1,0,woodTexture,floorTexture,floorTexture,floorTexture);

    this.pieces[25] = new MazePiece(1,0,0,1,floorTexture,floorTexture,floorTexture,floorTexture);
    this.pieces[26] = new MazePiece(1,1,0,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.pieces[27] = new MazePiece(1,1,1,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.pieces[28] = new MazePiece(0,0,1,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.pieces[29] = new MazePiece(0,0,1,1,floorTexture,floorTexture,floorTexture,floorTexture);

    this.pieces[30] = new MazePiece(1,0,0,1,floorTexture,floorTexture,floorTexture,heavenTexture);
    this.pieces[31] = new MazePiece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.pieces[32] = new MazePiece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.pieces[33] = new MazePiece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.pieces[34] = new MazePiece(1,0,1,0,floorTexture,floorTexture,floorTexture,floorTexture);
    
    this.width = 5;
    this.height = 7;
}

Maze.prototype.initBuffers = function(gl_) {
    for(var i=0; i<this.height; i++){
	for(var j=0; j<this.width; j++){
	    this.pieces[i*this.width+j].initBuffers(gl_);
	}
    }
}

Maze.prototype.draw = function(gl_,buffer_) {
    //theMatrix.push();
    for(var i=0; i<this.height; i++){
	for(var j=0; j<this.width; j++){
	    this.pieces[i*this.width+j].draw(gl_, buffer_);
	    theMatrix.translate([20,0,0]);
	}
	theMatrix.translate([-20*(this.width),0,-20]);
    }
    //theMatrix.pop();
}
