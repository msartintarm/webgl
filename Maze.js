function Maze() {  
    //f b r l
    //meaning the order this data is pushed in is front, back, left, right wall.
    this.pieces = [];
 
    this.hellRoom = new MazePiece(0,1,1,1,hellTexture,hellTexture,hellTexture, hellTexture);
    this.pieces.push(new MazePiece(0,1,0,1,brickTexture,brickTexture,brickTexture,brickTexture));
    this.pieces.push(new MazePiece(0,0,0,0,brickTexture,hellTexture,brickTexture,brickTexture));   
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
    this.hellRoom.initBuffers(gl_);
}

Maze.prototype.draw = function(gl_,buffer_) {
    theMatrix.push();
    theMatrix.translate([20, 0, 20]);
    this.hellRoom.draw(gl_,buffer_);
    theMatrix.pop();

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
