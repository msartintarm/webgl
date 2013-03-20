function StoolPyramid() { 
    this.o = new Stool;
}

StoolPyramid.prototype.initBuffers = _oInitBuffers;

const d_ = 2.75; // Arbitrary const denoting dist betwen chairs

StoolPyramid.prototype.draw = function(gl_, buffer_) {

    var seat_location = min_stool_height + 12*(stoolHeight.val/60)+12*0.02;


    for(var i = 5; i > 0; --i) {
	theMatrix.push();
	this.drawBase(gl_, buffer_, i);
	theMatrix.pop();
	theMatrix.translate([0, seat_location, -d_]);
    }
    
}


StoolPyramid.prototype.drawBase = function(gl_, buffer_, size) {

    for(var i = 0; i < size; ++i) {
	for(var j = 0; j < size - 1; ++j) {
	    this.o.draw(gl_, buffer_);
	    theMatrix.translate([-d_, 0, -d_]);
	}
	this.o.draw(gl_, buffer_);
	theMatrix.translate([(size) * d_, 0,
			     (size - 2) * d_]);
    }
}
