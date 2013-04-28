var stadiumInit;
function Stadium() {  
    moveDist = 100.1;
    lookDist = 1/15;
    stadiumInit = 0;

    //f b r l
    //meaning the order this data is pushed in is front, back, left, right wall.
    this.pieces = [];
    this.height = 7;

    this.balls = [];
    this.numberBalls = 50;
    //# of maze pieces per side of the square floor
    //must be divisble by 5280
    var piecesPerSide = 24;
    var pieceLength = 5280/24;
    this.size = pieceLength;
    this.width = piecesPerSide;

    if(5280%piecesPerSide != 0)
	alert("Not a proper selection of pieces per side");

    this.intro = new Quad(
	[-1200 + 70, 760 + 175, 1200 + 70],
	[-1200 + 70, 760 + 125, 1200 + 70],
	[-1200 - 70, 760 + 175, 1200 - 70],
	[-1200 - 70, 760 + 125, 1200 - 70]).setTexture(TEXT_TEXTURE);
    

    //initializes the field...floor and walls
    this.Field();
    this.InitBalls();
}

Stadium.prototype.initBuffers = function(gl_) {

    theCanvas.initText("Welcome to our game. --CRA --MST");
    this.intro.initBuffers(gl_);
    for(var i=0; i < this.pieces.length; ++i){
	this.pieces[i].initBuffers(gl_);
    }

    for(var i=0; i < this.balls.length; ++i){
	this.balls[i].initBuffers(gl_);
    }
}

Stadium.prototype.InitBalls = function(){
    for(var i=0; i < this.numberBalls; ++i){
	var x_dist = Math.round(Math.random()*5000);
	var z_dist = Math.round(Math.random()*-5000);
	this.balls.push(new Ball([x_dist,0,z_dist]));
    }
}

var sbX_;
var sh_;
var sbZ_;
var sbW_;

Stadium.prototype.Field = function(){

    sbX_ = this.size/2 + 14.9; // back X coordinates
    sh_ = this.size/2;    // height of wall                                      
    sbZ_ = this.size/2 -15.1;  // back Z coordinate                                   
    sbW_ = 30.0;  // width of back wall

    //stamp out square floor with proper variables
    for(var i=0;i<this.width; i++){
	for(var j=0;j<this.width; j++){
	    var wall = 0;
	    var movingWall = 0;
	    if(i==0)
		wall |= BACK;
	    if(j==0)
		wall |= LEFT;
	    if(i==(this.width-1))
		wall |= FRONT;
	    if(j==(this.width-1))
		wall |= RIGHT;

	    if(i==((this.width/2)-1) ){
		if(j != (this.width/4) &&
		   j != (this.width*3/4) )
		    movingWall |= FRONT;
	    }
	    
	    if(j==((this.width/2)-1) ){
		if(i != (this.width/4) &&
		   i != (this.width*3/4) )		
		movingWall |= RIGHT;
	    }

	    this.Piece(wall, movingWall, BRICK_TEXTURE).atCoord(j,i);	    
	}
    }
}

Stadium.prototype.Piece = function(a,b,c) {
    var newPiece = new StadiumPiece(this.size, a,b,c);
    this.pieces.push(newPiece);
    return newPiece;
}

Stadium.prototype.draw = function(gl_) {
    var ballInitOver = true;
    this.intro.draw(gl_);

    //we haven't looked at any balls yet so lets reset the collisions
    //this flag will tell us when we have a collision so that we 
    //do not encounter a deadlock type situation where both balls
    //are setting reflections on each other
    for(var i = 0; i<this.balls.length; i++){
	this.balls[i].ballCollide = false;
    }

    for(var i = 0; i<this.balls.length; i++){
	if(this.balls[i].init) ballInitOver = false;
	
	//check to see if balls hit something
	if(this.balls[i].velocity != 0 && !this.balls[i].ballCollide){
	    //update the ball position
	    this.balls[i].updatePosition(false);
	    var curPos = this.balls[i].oldPosition;
	    var newPos = this.balls[i].position;
	    
	    //calculate the pieces we need to check
	    var pieceX, pieceZ;
	    pieceX = Math.round(curPos[0] / this.size);
	    pieceZ = Math.round(curPos[2] /-this.size);
	    curPiece = (this.width * pieceZ) + pieceX;
	    
	    pieceX = Math.round(newPos[0] / this.size);
	    pieceZ = Math.round(newPos[2] /-this.size);
	    newPiece = (this.width * pieceZ) + pieceX;
	    
	    for(var j=0; j<this.balls.length; j++){
		//don't check detection with itself
		if(j!=i)
		    this.balls[i].checkBallCollision(this.balls[j]);
	    }
	    //check both current and new piece
	    this.balls[i].detectViewerCollision(curPos, newPos);
	    if(this.pieces[curPiece])
		this.pieces[curPiece].ballPositionLegal(curPos, newPos, this.balls[i]);
	    if(this.pieces[newPiece])
		this.pieces[newPiece].ballPositionLegal(curPos, newPos, this.balls[i]);
	}
	if(i === 0) {
	    this.balls[i].draw(gl_);
	} else {
	    this.balls[i].drawAgain(gl_);
	}
    }
    if(ballInitOver) stadiumInit = 1;

    for(var i = 0; i<this.pieces.length; i++){
	this.pieces[i].draw(gl_);
    }
}

/**
 *  Remember: (0,0) is top left, (20 * Width, -20 * Height) is
 *  bottom right, in the xz plane
 * 
 *  This function returns false if position is illegal
 */
Stadium.prototype.checkPosition = function() {
    var pieceX, pieceZ, curPiece, newPiece;
    var thePos = vec4.fromValues(0,0,0,1);
    var newPos = vec4.fromValues(0,0,0,1);
    var curPos = vec4.fromValues(0,0,0,1);

    vec4.transformMat4(newPos, thePos, theMatrix.vMatrixNew);
    vec4.transformMat4(newPos, newPos, theMatrix.vMatrix);
    vec4.transformMat4(curPos, curPos, theMatrix.vMatrix);

    pieceX = Math.round(curPos[0] / this.size);
    pieceZ = Math.round(curPos[2] /-this.size);
    curPiece = (this.width * pieceZ) + pieceX;

    pieceX = Math.round(newPos[0] / this.size);
    pieceZ = Math.round(newPos[2] /-this.size);
    newPiece = (this.width * pieceZ) + pieceX;

    var piecePosX = newPos[0] % this.size;
    var piecePosZ = newPos[2] % this.size;

    if(1==1) {
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

	posStats.innerHTML += "<br/> Stadium Piece: from " + 
	    curPiece +
	    " to " + newPiece;
	if(piecePosX > 10 && piecePosX < 12) posStats.innerHTML += 
	"<br/> Getting close to right wall..";
	else if(piecePosX > 8 && piecePosX < 10) posStats.innerHTML += 
	"<br/> Getting close to left wall..";
	if(piecePosZ < -10 && piecePosZ > -12) posStats.innerHTML += 
	"<br/> Getting close to top wall..";
	else if(piecePosZ < -8 && piecePosZ > -10) posStats.innerHTML += 
	"<br/> Getting close to bottom wall..";
	}

    if(newPiece < 0) { return false; }
    
    var ballCollision = false;
    //see if we collide with a ball
    for(var i = 0; i<this.balls.length; i++){
	if(!this.balls[i].detectViewerCollision(curPos, newPos)){
	    ballCollision = true;
	    i = this.balls.length;
	}
    }

    if(!this.pieces[newPiece].positionLegal(curPos, newPos) ||
       !this.pieces[curPiece].positionLegal(curPos, newPos)){
	mat4.identity(theMatrix.vMatrixNew, theMatrix.vMatrixNew);
    }
    return true;
}
