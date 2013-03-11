var kLong = 50;
var kLat = 50;

function Torus(innerRadius, outerRadius) { 
    this.o = new GLobject();

    for (var i = 0; i <= kLong; i++) {
	// From 0 to 2pi
	var theta = i * 2 / kLong * Math.PI;
	var sin_theta = Math.sin(theta);
	var y = Math.cos(theta);
	for (var j = 0; j <= kLat; j++) {
	    // From 0 to 2 pi
	    var phi = j * 2 / kLat * Math.PI;
	    var cos_phi = Math.cos(phi);
	    var sin_phi = Math.sin(phi);
	    // x = r sin theta cos phi
	    var x = sin_theta * cos_phi;
	    var z = sin_theta * sin_phi;

	    // Normals: similar to the sphere
	    this.o.addNorms(x, y, z);

	    // Done with normals. 
	    // Now, scale y by the inner disk
	    // And find x / z accordingly
	    var xzPlane = outerRadius + (innerRadius * sin_theta);
	    this.o.addPos(xzPlane * cos_phi, 
			  y * innerRadius, 
			  xzPlane * sin_phi);
	    this.o.addColors(x/2, y/2, z/2);
	}
    }

    // We have the vertices now - stitch them 
    //  into triangles
    // A  C 
    //        Two triangles: ABC and BDC
    // B  D   Longitude lines run through AB and  CD
    //        Array indices of C and D are A / B + 1

    var indexData = [];
    for (var latitude = 0; latitude < kLat; latitude++) {
	for (var longitude = 0; longitude < kLong; longitude++) {
	    var A = (latitude * (kLong + 1)) + longitude;
	    var B = A + kLong + 1;
	    var C = A + 1;
	    var D = B + 1;
	    this.o.addQuadIndexes(A, B, C, D);
	}
    }
    
};

Torus.prototype.initBuffers = function(gl_) {
    this.o.initBuffers(gl_);
}

Torus.prototype.draw = function(gl_) {
    this.o.drawBuffers(gl_);
};
