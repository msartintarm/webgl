var rotateY;

function Cylinder(base_radius, top_radius, height, slices, stacks) { 

    this.o = new GLobject();

    this.base_radius = base_radius;
    this.top_radius = top_radius;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;

    var radius_change = top_radius - base_radius;
    var radius_step_size = radius_change/stacks;
    var radius = base_radius;

    var theta = Math.atan(Math.abs(top_radius-base_radius)/height);
    var z_norm = Math.sin(theta);
    var xy =  Math.cos(theta);

    for (var i = 0; i <= stacks; i++) {
	// From 0 to height
	var z = (i/stacks)*height;
	if(i!=0) radius += radius_step_size;

	for (var j = 0; j <= slices; j++) {
	    // From 0 to 2 pi
	    var phi = j / (slices/2) * Math.PI;
	    // x = r sin theta cos phi
	    var x = 1 * Math.cos(phi);
	    var y = 1 * Math.sin(phi);

	    var x_norm = x*xy;
	    var y_norm = y*xy
	    // z norm = sin theta

	    this.o.addNorms(x_norm, y_norm, z_norm);;
	    this.o.addPos(radius * x, radius * y, z);

	    //not correct, to add texture to cylinder must adjust
	    this.o.addTexture(0.0, 0.0);  

	    this.o.addColors(colorVec.x,colorVec.y,colorVec.z);
	}
    }

    // We have the vertices now - stitch them 
    //  into triangles
    // A  C 
    //        Two triangles: ABC and BDC
    // B  D   Longitude lines run through AB and  CD
    //        Array indices of C and D are A / B + 1

    for (var latitude = 0; latitude < this.stacks; latitude++) {
	for (var longitude = 0; longitude < this.slices; longitude++) {
	    var A = (latitude * (this.slices + 1)) + longitude;
	    var B = A + this.slices + 1;
	    var C = A + 1;
	    var D = B + 1;
	    this.o.addIndexes(A, B, C);
	    this.o.addIndexes(B, D, C);
	}
    }
}

Cylinder.prototype.drawScrew = function(gl_) {

    var radius_change = this.top_radius - this.base_radius;
    var radius_step_size = radius_change/this.stacks;
    var radius = this.base_radius;

    var theta = Math.atan(Math.abs(this.top_radius-this.base_radius)/this.height);
    var z_norm = Math.sin(theta);
    var xy =  Math.cos(theta);

    var radius = this.base_radius;

    var index = 0;

    var minAngle = 0;
    var maxAngle = 3 / (this.slices/2) * Math.PI;

    for (var i = 1; i <= this.stacks - 4; i++) {
	// From 0 to height
	var z = (i/this.stacks)*this.height;
	if(i!=0) radius += radius_step_size;

	for (var j = 0; j <= this.slices; j++) {

	    // From 0 to 2 pi
	    var phi = j / (this.slices/2) * Math.PI;
	    // x = r sin theta cos phi

	    if(minAngle < phi && phi < maxAngle) {
//		alert("Index: " + 
//		      index + 
//		      ", position: " + 
//		      this.o.posData[index] +
//		      " -> " + 
//		      radius * 0.5 * x + 
//		      ".");
	    var x = 1 * Math.cos(phi);
	    var y = 1 * Math.sin(phi);
		this.o.posData[index] /= 0.9;
		this.o.posData[index+1] /= 0.9;
		this.o.posData[index+(3*this.slices)] *= 0.9;
		this.o.posData[index+1+(3*this.slices)] *= 0.9;
		this.o.posData[index-(3*this.slices)] *= 0.9;
		this.o.posData[index+1-(3*this.slices)] *= 0.9;
		this.o.colData[index] /= 0.3;
		this.o.colData[index+1] /= 0.3;
		this.o.colData[index+2] /= 0.3;
//		this.o.colData[index+this.slices] = 0.0;
//		this.o.colData[index+1+this.slices] = 0.0;
//		this.o.colData[index+2+this.slices] = 0.0;
	    }

	    index += 3;
	}
	minAngle += 1 / this.slices * Math.PI * 2;
	maxAngle += 1 / this.slices * Math.PI * 2;
	minAngle %= Math.PI * 2;
	maxAngle %= Math.PI * 2;
    }

    this.o.initBuffers(gl_);
};

Cylinder.prototype.drawBlackStreak = function(gl_) {

    var radius_change = this.top_radius - this.base_radius;
    var radius_step_size = radius_change/this.stacks;
    var radius = this.base_radius;

    var theta = Math.atan(Math.abs(this.top_radius-this.base_radius)/this.height);
    var z_norm = Math.sin(theta);
    var xy =  Math.cos(theta);

    var radius = this.base_radius;

    var index = 0;

    var minAngle = 0;
    var maxAngle = 3 / (this.slices/2) * Math.PI;

    for (var i = 0; i <= this.stacks - 4; i++) {
	// From 0 to height
	var z = (i/this.stacks)*this.height;
	if(i!=0) radius += radius_step_size;

	for (var j = 0; j <= this.slices; j++) {

	    // From 0 to 2 pi
	    var phi = j / (this.slices/2) * Math.PI;
	    // x = r sin theta cos phi

	    if(minAngle < phi && phi < maxAngle) {
		this.o.colData[index] = 0.0;
		this.o.colData[index+1] = 0.0;
		this.o.colData[index+2] = 0.0;
		this.o.colData[index+(3*this.slices)] = 0.0;
		this.o.colData[index+1+(3*this.slices)] = 0.0;
		this.o.colData[index+2+(3*this.slices)] = 0.0;
	    }

	    index += 3;
	}
	minAngle += 1 / this.slices * Math.PI * 2;
	maxAngle += 1 / this.slices * Math.PI * 2;
	minAngle %= Math.PI * 2; 
	maxAngle %= Math.PI * 2;
    }
    this.o.initBuffers(gl_);
}    

Cylinder.prototype.initBuffers = function(gl_) {
    this.o.initBuffers(gl_);
}

Cylinder.prototype.draw = function(gl_, buffer_) {
    this.o.drawBuffers(gl_, buffer_);
};
