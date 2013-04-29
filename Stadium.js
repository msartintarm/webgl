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

    this.numbers = new GLstring("0 1 2 3 4 5 6 7 8 9");
    this.introScreen = new GLstring("Welcome to our game. --CRA --MST");

    if(5280%piecesPerSide != 0)
	alert("Not a proper selection of pieces per side");

    this.intro = new Quad(
	[-1200 + 70, 760 + 175, 1200 + 70],
	[-1200 + 70, 760 + 125, 1200 + 70],
	[-1200 - 70, 760 + 175, 1200 - 70],
	[-1200 - 70, 760 + 125, 1200 - 70]).setTexture(this.introScreen.texture_num);
    

    //initializes the field...floor and walls
    this.Field();
    this.InitBalls();
}

Stadium.prototype.initBuffers = function(gl_) {

    this.intro.initBuffers(gl_);
    this.numbers.initBuffers(gl_);
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
	this.balls.push(new Ball([x_dist,0,z_dist], this.numbers.texture_num, this.numberBalls));
    }
}

Stadium.prototype.Field = function(){

    var sbX_ = this.size/2;
    var sh_ = this.size/2;
    var sbZ_ = this.size/2;
    var sbW_ = 30.0; 

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
	    
	    this.pieces.push(
		new StadiumPiece(
		    this.size, wall, movingWall, BRICK_TEXTURE,
		    sbX_, sh_, sbZ_, sbW_
		).atCoord(j,i)
	    );	    
	}
    }
}

Stadium.prototype.draw = function(gl_) {
    var ballInitOver = true;
    if(stadiumInit === 0)
	this.intro.draw(gl_);

    //we haven't looked at any balls yet so lets reset the collisions
    //this flag will tell us when we have a collision so that we 
    //do not encounter a deadlock type situation where both balls
    //are setting reflections on each other
    var numBallsHit = 0;
    var gameOver = false;
    for(var i = 0; i<this.balls.length; i++){
	this.balls[i].ballCollide = false;
	if(this.balls[i].hit == true && !this.balls[i].gameOver)
	    numBallsHit++;
	if(this.balls[i].gameOver)
	    gameOver = true;
    }
    if(numBallsHit == this.numberBalls)
	alert("You win the game!");

    for(var i = 0; i<this.balls.length; i++){
	if(this.balls[i].init) ballInitOver = false;
	
	//the game has ended let every ball know
	if(numBallsHit == this.numberBalls || gameOver)
	    this.balls[i].gameOver = true;

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
	    //checks viewer collision even if you aren't moving
	    //need a new method here, for when the viewer is not moving
	    this.balls[i].detectViewerCollision(curPos, newPos, false);

	    if(this.pieces[curPiece])
		this.pieces[curPiece].ballPositionLegal(curPos, newPos, this.balls[i]);
	    if(this.pieces[newPiece])
		this.pieces[newPiece].ballPositionLegal(curPos, newPos, this.balls[i]);
	}

	this.balls[i].draw(gl_);
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

    //see if we collide with a ball

    if(!this.pieces[newPiece].positionLegal(curPos, newPos) ||
       !this.pieces[curPiece].positionLegal(curPos, newPos)){
	mat4.identity(theMatrix.vMatrixNew, theMatrix.vMatrixNew);
	curPos[0] = newPos[0];
	curPos[2] = newPos[2];
    }
    for(var i = 0; i<this.balls.length; i++){
	this.balls[i].detectViewerCollision(curPos, newPos, true);
	this.balls[i].getRotationAngle(curPos);
    }
    return true;
}
