function Maze() { 
    //f b r l
    this.pieces = [];
 
    this.pieces.push(new MazePiece(0,1,0,1,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(0,1,0,0,brickTexture,hellTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(1,1,0,0,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(0,1,0,0,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(0,1,1,0,brickTexture,brickTexture,brickTexture,brickTexture));
    
    this.pieces.push(new MazePiece(0,0,1,1,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(1,0,0,1,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture));

    this.pieces.push(new MazePiece(0,0,1,1,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(1,0,0,0,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture));

    this.pieces.push(new MazePiece(0,0,0,1,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(0,0,0,1,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(1,0,0,0,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(1,0,0,1,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture));

    this.pieces.push(new MazePiece(0,0,1,1,floorTexture,floorTexture,floorTexture,floorTexture));
    this.pieces.push(new MazePiece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture));
    this.pieces.push(new MazePiece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture));
    this.pieces.push(new MazePiece(0,0,1,0,floorTexture,floorTexture,floorTexture,floorTexture));
    this.pieces.push(new MazePiece(1,0,1,0,woodTexture,floorTexture,floorTexture,floorTexture));

    this.pieces.push(new MazePiece(1,0,0,1,floorTexture,floorTexture,floorTexture,floorTexture));
    this.pieces.push(new MazePiece(1,1,0,0,floorTexture,floorTexture,floorTexture,floorTexture));
    this.pieces.push(new MazePiece(1,1,1,0,floorTexture,floorTexture,floorTexture,floorTexture));
    this.pieces.push(new MazePiece(0,0,1,0,floorTexture,floorTexture,floorTexture,floorTexture));
    this.pieces.push(new MazePiece(0,0,1,1,floorTexture,floorTexture,floorTexture,floorTexture));

    this.pieces.push(new MazePiece(1,0,0,1,floorTexture,floorTexture,floorTexture,heavenTexture));
    this.pieces.push(new MazePiece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture));
    this.pieces.push(new MazePiece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture));
    this.pieces.push(new MazePiece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture));
    this.pieces.push(new MazePiece(1,0,1,0,floorTexture,floorTexture,floorTexture,floorTexture));
    
    this.width = 5;
    this.height = 7;
}

Maze.prototype.initBuffers = function(gl_) {
    for(var i=0; i < this.pieces.length; ++i){
	this.pieces[i].initBuffers(gl_);
    }
}

Maze.prototype.draw = function(gl_,buffer_) {
    theMatrix.push();
    for(var i=0; i<this.height; i++){
	for(var j=0; j<this.width; j++){
	    this.pieces[i*this.width+j].draw(gl_, buffer_);
	    theMatrix.translate([20,0,0]);
	}
	theMatrix.translate([-20*(this.width),0,-20]);
    }
    theMatrix.pop();
}
