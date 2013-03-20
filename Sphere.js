var kLong = 50;
var kLat = 50;

function Sphere(radius) { 
    this.o = new GLobject();

    for (var i = 0; i <= kLong; i++) {
	// From 0 to pi
	var theta = i / kLong * Math.PI;
	var y = Math.cos(theta);
	var sin_theta = Math.sin(theta);
	for (var j = 0; j <= kLat; j++) {
	    // From 0 to 2 pi
	    var phi = j * 2 / kLat * Math.PI;
	    // x = r sin theta cos phi
	    var x = sin_theta * Math.cos(phi);
	    var z = sin_theta * Math.sin(phi);

	    this.o.addNorms(x, y, z);
	    this.o.addPos(radius * x,
	                  radius * y,
			  radius * z);

	    //not correct to add texture must set properly
	    this.o.addTexture(0.0, 0.0);  
	    
	    this.o.addColors(x,y,z);
	    //this.o.addColors(x/2, y/2, z/2);
	}
    }

    // We have the vertices now - stitch them 
    //  into triangles
    // A  C 
    //        Two triangles: ABC and BDC
    // B  D   Longitude lines run through AB and  CD
    //        Array indices of C and D are A / B + 1
    for (var i = 0; i < kLat; i++) {
	var A = (i * (kLong + 1));
	var C = A + kLong + 1;
	for (var j = 0; j < kLong; j++) {
	    this.o.addQuadIndexes(A++,C++);
	}
    }
}

Sphere.prototype.initBuffers = _oInitBuffers;
Sphere.prototype.draw = _oDraw;
Sphere.prototype.translate = _oTranslate;
