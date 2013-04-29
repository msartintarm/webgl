function Ball(position, texture_num, numBalls) { 
//    this.velocity;
//    this.position;
//    this.color;
    this.radius = 25;
    this.timeLeft = 100;
    this.hit = false;
    this.sphere = new Sphere(this.radius);
    this.timer = 0;
    this.birthTime = 0;
    this.numberBalls = numBalls;
    this.localFrame = 0;
    this.gameOver = false;
    //array of quads, then change to coordinates of the texture
    //all set the same texture but the coorinates being picked off in the texture
    //will change.
    
    this.textQuad = [];
    
    for(var i=0; i<10; i++){
	this.textQuad[i] = new Quad([0,60,10],[0,30,10],[0,60,-10],[0,30,-10]).setStringTexture(texture_num,i);
    }
	  
    this.position = [50,this.radius,-50];
    this.init = true;
    this.velocityVec = vec3.create();
    this.velocity = 0;
    vec3.normalize(this.velocityVec, vec3.fromValues(position[0],position[1],position[2]));
    this.startPosition = position;
    this.oldPosition = position;
    this.ballCollide = false;
    this.ballRotationAngle = Math.PI/4;
}

var timeStep = 0;
Ball.prototype.initBalls = function(){
    var y_position = ( ((Math.abs(this.position[0]-this.startPosition[0]))/5) *
	Math.abs(Math.cos(timeStep/(300*Math.PI)))) + this.radius;

    timeStep++;

    if(Math.abs(this.position[0]-this.startPosition[0]) +
       Math.abs(this.position[2] < this.startPosition[2]) > 50){

	this.position[1] = Math.abs(y_position);
	this.position[0] += this.velocityVec[0]*20;
	this.position[2] += this.velocityVec[2]*20;
    }
    else{
	this.init = false;
	this.position[1] = this.radius;
    }
}
Ball.prototype.initBuffers = function (gl_){
    this.sphere.initBuffers(gl_);
    for(var i=0; i<10; i++){
	this.textQuad[i].initBuffers(gl_);
    }
}

Ball.prototype.getRotationAngle= function (viewerPos){
    var hypt = vec3.distance(
	vec3.fromValues(viewerPos[0], viewerPos[1], viewerPos[2]),
	vec3.fromValues(this.position[0],this.position[1],this.position[2]));
    var oppo = viewerPos[0]-this.position[0];
    hypt = Math.abs(hypt);

    var compAngle = Math.PI/2;

    //When you cross 90 degree plane you have to compensate direction
    if(viewerPos[2]-this.position[2] <= 0){
	oppo = -1*oppo;
	compAngle += Math.PI;
    }

    this.ballRotationAngle = Math.asin(oppo/hypt)+ compAngle;
}

Ball.prototype.draw = function(gl_) {
    if(this.init) this.initBalls();

    theMatrix.push();
    theMatrix.translate([this.position[0],this.position[1],this.position[2]]);
    theMatrix.rotate(this.ballRotationAngle, [0,1,0]);
    this.sphere.draw(gl_);

    if(this.timer>0 && this.hit){
	//subtract starting time with difference between birthtime and now
	this.timer = (this.numberBalls*2 +30) - Math.round(((new Date().getTime()/1000)-this.birthTime));
    }
    if(this.timer == 0 && this.hit && !this.gameOver){
	alert("you lose");
	this.gameOver = true;
    }


    var hundreds = Math.floor(this.timer/100);
    var tens = Math.floor((this.timer - hundreds*100)/10);
    var ones = Math.floor((this.timer - hundreds*100 - tens*10));

    if(this.timer <= 0){
	hundreds = 0;
	tens = 0;
	ones = 0;
    }

    //center quad
    this.textQuad[tens].draw(gl_);

    //right quad
    theMatrix.translate([0,0,20]);
    this.textQuad[ones].draw(gl_);

    //left quad
    theMatrix.translate([0,0,-40]);
    this.textQuad[hundreds].draw(gl_);

    theMatrix.pop();
}

Ball.prototype.drawAgain = function(gl_) {
    if(this.init) this.initBalls();

    theMatrix.push();
    theMatrix.translate([this.position[0],this.position[1],this.position[2]]);
    this.sphere.drawAgain(gl_);
    theMatrix.pop();
}

Ball.prototype.reflect = function(flip_x){
    //handles reflections when we hitting a wall flipping the velocity
    if(flip_x){
	this.velocityVec[0] = this.velocityVec[0] * -1;
    }
    else{
	this.velocityVec[2] = this.velocityVec[2] * -1;
    }
    //revert back to old position(don't move past wall)
    this.updatePosition(true);
}

Ball.prototype.detectViewerCollision = function(oldPosition, newPosition, viewerMove){
    //sign of *_dir will tell you if you are heading in - or + resp direction
    // *_dir will also give you the vector of movement
    // vector will be necessary for bouncing
    var x_dir = newPosition[0] - oldPosition[0];
    var z_dir = newPosition[2] - oldPosition[2];

    //check to see if we cross sphere on z axis
    var newPos = vec2.fromValues(newPosition[0],newPosition[2]);
    var ballPos = vec2.fromValues(this.position[0], this.position[2]);

    //calculate distance
    var distance = vec2.distance(newPos, ballPos);

    //if we are within two radius' of ball we have a collision
    if(distance < 2*this.radius){
	//alert("HIT");
	if(!this.hit){
	    this.timer = this.numberBalls*2 +30;
	    this.birthTime = Math.round(new Date().getTime()/1000);
	}
	this.hit = true;
	vec3.normalize(this.velocityVec, vec3.fromValues(x_dir,0,z_dir));	
	if(viewerMove)
	    this.velocity = 100;
	return false;
    }

    return true;
}

Ball.prototype.checkBallCollision = function(ball){
    //sign of *_dir will tell you if you are heading in - or + resp direction
    // *_dir will also give you the vector of movement
    // vector will be necessary for bouncing
    var x_dir = ball.position[0] - this.position[0];
    var z_dir = ball.position[2] - this.position[2];

    //check to see if we cross sphere on z axis
    var newPos = vec2.fromValues(this.position[0],this.position[2]);
    var ballPos = vec2.fromValues(ball.position[0], ball.position[2]);

    //calculate distance
    var distance = vec2.distance(newPos, ballPos);
    //if we are within two radius' of ball we have a collision
    if(distance < 2*this.radius){
	//alert("HIT");
	if(!this.hit){
	    this.timer = this.numberBalls*2 +30;
	    this.birthTime = Math.round(new Date().getTime()/1000);
	}
	this.hit = true;
	vec3.normalize(ball.velocityVec, vec3.fromValues(x_dir,0,z_dir));	
	this.velocityVec[0] = -1*ball.velocityVec[0];
	this.velocityVec[2] = -1*ball.velocityVec[2];
	ball.updatePosition(false);
	this.updatePosition(true);
	ball.velocity = this.velocity;
	ball.ballCollide = true;
    }

}

Ball.prototype.updatePosition = function(revert){
    //updates position if we have a velocity
    //gives the option to revert the position (not make the move)
    if(revert){
	this.position[0] = this.oldPosition[0];
	this.position[2] = this.oldPosition[2];
    }
    else{
	this.oldPosition[0] = this.position[0];
	this.oldPosition[2] = this.position[2];
    }
    this.position[0] += this.velocityVec[0] * this.velocity/5;
    this.position[2] += this.velocityVec[2] * this.velocity/5;
    this.velocity-= 0.5;
}

