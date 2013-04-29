function Ball(position, texture_num) { 
//    this.velocity;
//    this.position;
//    this.color;
    this.radius = 25;
    this.timeLeft = 100;
    this.hit = false;
    this.sphere = new Sphere(this.radius);

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

Ball.prototype.draw = function(gl_) {
    if(this.init) this.initBalls();

    theMatrix.push();
    theMatrix.translate([this.position[0],this.position[1],this.position[2]]);
    this.sphere.draw(gl_);
    for(var i=0; i<10; i++){
	this.textQuad[i].draw(gl_);
    }
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

