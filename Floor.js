function Floor(width, height, countX, countY) { 
    this.o = new GLobject();
    for(var x = -countX / 2; x < countX / 2; ++x) {
    var vX = width * x;
	for(var y = -countY / 2; y < countY / 2; ++y) {
	    var vY = height * y;
	    this.o.Quad(
		new vec3(vX + width, 0, vY),
		new vec3(vX, 0, vY),
		new vec3(vX + width, 0, vY + height),
		new vec3(vX, 0, vY + height)
	    );
	}
    }
}

Floor.prototype.initBuffers = function(gl_) {
    this.o.initBuffers(gl_);
}

Floor.prototype.draw = function(gl_, buffer_) {
    this.o.drawBuffers(gl_, buffer_);
    
}
