var start;

function Stadium() {  
    //f b r l
    //meaning the order this data is pushed in is front, back, left, right wall.
    this.pieces = [];
    this.width = 5;
    this.height = 7;
    this.size = 20;

    //initializes the field...floor and walls
    this.Field();
    this.Sphere = new Sphere(2);
}

Stadium.prototype.initBuffers = function(gl_) {
    for(var i=0; i < this.pieces.length; ++i){
	this.pieces[i].initBuffers(gl_);
    }
    this.Sphere.initBuffers(gl_);
}

Stadium.prototype.Field = function(){
    //# of maze pieces per side of the square floor
    //must be divisble by 5280
    var piecesPerSide = 24;
    var pieceLength = 5280/24;
    this.size = pieceLength;
    this.width = pieceLength;

    if(5280%piecesPerSide != 0)
	alert("Not a proper selection of pieces per side");

    piecesPerSide = 1;
    //stamp out square floor with proper variables
    for(var i=0;i<piecesPerSide; i++){
	for(var j=0;j<piecesPerSide; j++){
	    var wall = 0;
	    if(i==0)
		wall |= BACK;
	    if(j==0)
		wall |= RIGHT;
	    if(i==(piecesPerSide-1))
		wall |= FRONT;
	    if(j==(piecesPerSide-1))
		wall |= LEFT;


	    console.log("putting out.... %d %d", i, j);
	    this.Piece(0xf, BRICK_TEXTURE).atCoord(i,j);	    
	}
    }

    start = true;
}

Stadium.prototype.Piece = function(a,b) {
    var newPiece = new MazePiece(this.size, a,b);
    this.pieces.push(newPiece);
    return newPiece;
}

Stadium.prototype.draw = function(gl_,buffer_) {
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
Stadium.prototype.checkPosition = function() {
    var pieceX, pieceZ, curPiece, newPiece;
    var thePos = vec4.fromValues(0,0,0,1);
    var newPos = vec4.fromValues(0,0,0,1);
    var curPos = vec4.fromValues(0,0,0,1);

    vec4.transformMat4(newPos, thePos, theMatrix.vMatrixNew);
    vec4.transformMat4(newPos, newPos, theMatrix.vMatrix);
    vec4.transformMat4(curPos, curPos, theMatrix.vMatrix);

    pieceX = Math.round(curPos[0] / 20);
    pieceZ = Math.round(curPos[2] /-20);
    curPiece = (this.width * pieceZ) + pieceX;
    pieceX = Math.round(newPos[0] / 20);
    pieceZ = Math.round(newPos[2] /-20);
    newPiece = (this.width * pieceZ) + pieceX;

    var piecePosX = newPos[0] % 20;
    var piecePosZ = newPos[2] % 20;

    if(mazeDebug == true) {
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

    if(curPiece == 1) start = false;

    if(!start){
	if(newPiece < 0) { return false; }
	
	if((curPiece >= 0) && 
	   (!this.pieces[curPiece].positionLegal(newPos)) ||
	   (!this.pieces[newPiece].positionLegal(newPos))) {

	    mat4.identity(theMatrix.vMatrixNew, theMatrix.vMatrixNew);
	    if(curPiece == 30){
		alert("You win the game, now I give you GOD mode..");
		priveledgedMode.toggle();
		mat4.translate(theMatrix.vMatrixNew, theMatrix.vMatrixNew, [0,2,-10]);
		
		return true;
	    }
	    else
		return false;
	}	
    }
    return true;
}
