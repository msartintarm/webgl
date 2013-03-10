var canvas;
var gl;

var rotateY;

var shaderProgram;

var CylinderPositionBuffer;
var CylinderNormalBuffer;
var CylinderColorBuffer;
var CylinderIndexBuffer;
var colorVec;

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
	    this.o.addColors(colorVec.x,colorVec.y,colorVec.z);
	}
    }

    // We have the vertices now - stitch them 
    //  into triangles
    // A  C 
    //        Two triangles: ABC and BDC
    // B  D   Longitude lines run through AB and  CD
    //        Array indices of C and D are A / B + 1

    var indexData = [];
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

    radius = base_radius;

    var index = 0;

    var minAngle = 0;
    var maxAngle = 3 / (slices/2) * Math.PI;

    for (var i = 0; i <= stacks - 4; i++) {
	// From 0 to height
	var z = (i/stacks)*height;
	if(i!=0) radius += radius_step_size;

	for (var j = 0; j <= slices; j++) {

	    // From 0 to 2 pi
	    var phi = j / (slices/2) * Math.PI;
	    // x = r sin theta cos phi

//		alert("Min angle: " + minAngle + ", max angle: " + maxAngle +
//		      ", phi: " + phi);



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
//		this.o.posData[index] = radius * 0.8 * x;
//		this.o.posData[index+1] = radius * 0.8 * y;
//		this.o.colData[index] = 1.0;
//		this.o.colData[index+1] = 1.0;
	    }

	    index += 3;
	}
	minAngle += 2 / slices * Math.PI * 2;
	maxAngle += 2 / slices * Math.PI * 2;
	minAngle %= Math.PI * 2;
	maxAngle %= Math.PI * 2;
    }

    this.o.initBuffers();
};

Cylinder.prototype.draw = function() {
    this.o.drawBuffers();
};
