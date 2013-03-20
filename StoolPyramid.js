var colorVec;

function StoolPyramid() { 
    this.objs = [];
    this.sp = new Stool();
    colorVec = [1,0,0];
    this.disk = new Disk(1, 2, 30, 30);
    this.sphere = new Sphere(2);
    this.cylinder = new Cylinder(1,2,3,150,150);
    this.torus = new Torus(0.2,2);
    this.objs.push(this.sp);
    this.objs.push(this.disk);
    this.objs.push(this.sphere);
    this.objs.push(this.cylinder);
    this.objs.push(this.torus);
}

//StoolPyramid.prototype.Stool = _Stool;
StoolPyramid.prototype.initBuffers = _objsInitBuffers;

const d_ = 2.75; // Arbitrary const denoting dist betwen chairs

StoolPyramid.prototype.draw = function(gl_, buffer_) {

    var seat_location = min_stool_height + 12*(stoolHeight.val/60)+12*0.02;

    //place other objects
    theMatrix.push();
    theMatrix.translate([40,2,-100]);
    this.disk.draw(gl_, buffer_);
    theMatrix.translate([40,0,0]);
    this.sphere.draw(gl_,buffer_);

    theMatrix.translate([0,0,20]);
    this.torus.draw(gl_, buffer_);
    theMatrix.translate([-40,2,60]);
    this.cylinder.draw(gl_, buffer_);

    theMatrix.pop();

    //place stool pyramid
    theMatrix.push();
    theMatrix.translate([-40,0,-110]);
    for(var i = 5; i > 0; --i) {
	theMatrix.push();
	this.drawBase(gl_, buffer_, i);
	theMatrix.pop();
	theMatrix.translate([0, seat_location, -d_]);
    }
    theMatrix.pop();
}


StoolPyramid.prototype.drawBase = function(gl_, buffer_, size) {

    for(var i = 0; i < size; ++i) {
	for(var j = 0; j < size - 1; ++j) {
	    this.sp.draw(gl_, buffer_);
	    theMatrix.translate([-d_, 0, -d_]);
	}
	this.sp.draw(gl_, buffer_);
	theMatrix.translate([(size) * d_, 0,
			     (size - 2) * d_]);
    }
}
