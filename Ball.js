function Ball(position) { 
//    this.velocity;
//    this.position;
//    this.color;
    this.radius = 5;
    this.timeLeft = 100;
    this.hit = false;
    this.sphere = new Sphere(this.radius);
    this.position = position;
}

Ball.prototype.initBuffers = function (gl_){
    this.sphere.initBuffers(gl_);
}

Ball.prototype.draw = function(gl_,buffer_) {
    theMatrix.push();
    theMatrix.translate([this.position[0],this.radius,this.position[1]]);
    this.sphere.draw(gl_,buffer_);
    theMatrix.pop();
}

Ball.prototype.detectCollision = function(oldPosition, newPosition){
    //sign of *_dir will tell you if you are heading in - or + resp direction
    // *_dir will also give you the vector of movement
    // vector will be necessary for bouncing
    var x_dir = newPosition[0] - oldPosition[0];
    var z_dir = newPosition[2] - oldPosition[2];

    //check to see if we cross sphere on z axis
    var newPos = vec2.fromValues(newPosition[0],newPosition[2]);
    var ballPos = vec2.fromValues(this.position[0], this.position[1]);

    //calculate distance
    var distance = vec2.distance(newPos, ballPos);

    //if we are within two radius' of ball we have a collision
    if(distance < 2*this.radius){
	alert("HIT");
	return false;
    }

    return true;
}

