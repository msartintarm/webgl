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

    //moving in the +x direction
    //and in proper z plane for collision
    //need to check two radius's out
    //remember you are a ball as well.

    var hit_x = false;
    var hit_z = false;

    //check to see if we cross sphere on x axis
    if(x_dir > 0){
	if(oldPosition[0]-(this.radius) <= this.position[0] &&
	   this.position[0] <= newPosition[0]+this.radius){
//	    alert("HIT X Pos");
	    hit_x = true;;
	}
    }
    else if(x_dir < 0){
	if((newPosition[0]-this.radius) <= this.position[0] &&
	   this.position[0] <= (oldPosition[0]+this.radius)){
//	    alert("HIT X Neg");
	    hit_x = true;
	}
    } 

    //check to see if we cross sphere on z axis
    if(z_dir > 0){
	if((oldPosition[2]-this.radius) <= this.position[1] &&
	   this.position[1] <= (newPosition[2]+this.radius)){
//	    alert("HIT Z Pos");
	    hit_z = true;;
	}
    }
    else if(z_dir < 0){
	if((newPosition[2]-this.radius) <= this.position[1] &&
	   this.position[1] <= (oldPosition[2]+this.radius)){
//	    alert("HIT Z Neg");
	    hit_z = true;
	}
    } 

    //if we hit in z and are not moving in x we still need to check x
    if(oldPosition[0]-(this.radius) <= this.position[0] &&
       this.position[0] <= newPosition[0]+this.radius){
	//	    alert("HIT X Pos");
	hit_x = true;;
    }
    if(oldPosition[0]-(this.radius) <= this.position[0] &&
       this.position[0] <= newPosition[0]+this.radius){
	//	    alert("HIT X Pos");
	hit_x = true;;
    }
    

    //if both are true we have a collision
    if(hit_x && hit_z){
	alert("HIT");
	return false;
    }

    return true;
}

