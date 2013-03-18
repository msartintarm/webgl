const NO_FRONT = BACK | RIGHT | LEFT;
const BACK_LEFT = BACK | LEFT;
const NONE = 0x0;
const NONE = 0x0;
const FRONT_BACK = FRONT | BACK;
const BACK_RIGHT = RIGHT | BACK;
const LEFT_RIGHT = RIGHT | LEFT;
const FRONT_LEFT = FRONT | LEFT;


function Maze() {  
    //f b r l
    //meaning the order this data is pushed in is front, back, left, right wall.
    this.pieces = [];
    this.width = 5;
    this.height = 7;
 
    this.hellRoom = new MazePiece(0,1,1,1,
				  hellTexture,
				  hellTexture,
				  hellTexture, 
				  hellTexture).translate([20, 0, 20]);
    this.Piece(0,1,0,1,
	       brickTexture,
	       brickTexture,
	       brickTexture,
	       brickTexture);
    this.Piece(0,0,0,0,brickTexture,hellTexture,brickTexture,brickTexture);   
    this.Piece(1,1,0,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(0,1,0,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(0,1,1,0,brickTexture,brickTexture,brickTexture,brickTexture);
    
    this.Piece(0,0,1,1,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(1,0,0,1,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);

    this.Piece(0,0,1,1,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(1,0,0,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);

    this.Piece(0,0,0,1,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(0,0,0,1,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(1,0,0,0,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(1,0,0,1,brickTexture,brickTexture,brickTexture,brickTexture);
    this.Piece(0,0,1,0,brickTexture,brickTexture,brickTexture,brickTexture);

    this.Piece(0,0,1,1,floorTexture,floorTexture,floorTexture,floorTexture);
    this.Piece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.Piece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.Piece(0,0,1,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.Piece(1,0,1,0,woodTexture,floorTexture,floorTexture,floorTexture);

    this.Piece(1,0,0,1,floorTexture,floorTexture,floorTexture,floorTexture);
    this.Piece(1,1,0,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.Piece(1,1,1,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.Piece(0,0,1,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.Piece(0,0,1,1,floorTexture,floorTexture,floorTexture,floorTexture);

    this.Piece(1,0,0,1,floorTexture,floorTexture,floorTexture,heavenTexture);
    this.Piece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.Piece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.Piece(1,0,0,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.Piece(1,0,1,0,floorTexture,floorTexture,floorTexture,floorTexture);
    this.transPieces();
}

Maze.prototype.initBuffers = function(gl_) {
    for(var i=0; i < this.pieces.length; ++i){
	this.pieces[i].initBuffers(gl_);
    }
    this.hellRoom.initBuffers(gl_);
}

Maze.prototype.Piece = function(a,b,c,d,e,f,g,h) {
    var newPiece = new MazePiece(a,b,c,d,e,f,g,h);
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

// Based upon the piece number, translate it by its coords
Maze.prototype.transPiece = function(num) {
    var theWidth = num % this.width;
    var theHeight = (num - theWidth) / this.width;
    theMatrix.translate([theWidth * 20, 0, theHeight * -20]);
}

Maze.prototype.draw = function(gl_,buffer_) {
    this.hellRoom.draw(gl_,buffer_);
    for(var i=0; i<this.height; i++){
	for(var j=0; j<this.width; j++){
	    this.pieces[i*this.width+j].draw(gl_, buffer_);
	}
    }
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
