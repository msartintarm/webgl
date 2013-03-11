var diskPositionBuffer;
var diskNormalBuffer;
var diskColorBuffer;
var diskIndexBuffer;
var colorVec;

function Disk(inner_radius, outer_radius, slices, loops) {

    this.o = new GLobject();
 
    this.inner_radius = inner_radius;
    this.outer_radius = outer_radius;
    this.slices = slices;
    this.loops = loops;

    var normalData = [];
    var positionData = [];
    var colorData = [];

    var radius_step_size = (outer_radius-inner_radius)/loops;
    var radius = inner_radius;

    for (var i = 0; i <= loops; i++) {
	if(i!=0) radius += radius_step_size;
	for (var j = 0; j <= slices; j++) {
	    // From 0 to 2 pi
	    var phi = j / (slices/2) * Math.PI;
	    // x = r sin theta cos phi
	    var x = 1 * Math.cos(phi);
	    var y = 1 * Math.sin(phi);
	    var z = 0;

	    this.o.addNorms(0, 0, 1);
	    this.o.addPos(radius * x, radius * y, z);

	    //not correct to add textures must adjust
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

    var indexData = [];
    for (var latitude = 0; latitude < slices; latitude++) {
	for (var longitude = 0; longitude < loops; longitude++) {
	    var A = (latitude * (slices + 1)) + longitude;
	    var B = A + slices + 1;
	    var C = A + 1;
	    var D = B + 1;
	    this.o.addIndexes(A, B, C);
	    this.o.addIndexes(B, D, C);
	}
    }
    this.o.initBuffers();
};

Disk.prototype.draw = function() {
    this.o.drawBuffers();
};
