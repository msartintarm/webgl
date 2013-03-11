function Light() {
    this.o = new Sphere(0.5);
}

Light.prototype.initBuffers = function(gl_) {
    this.o.initBuffers(gl_);
}

Light.prototype.draw = function() {
    theMatrix.translate(rotatedLightPos);
    this.o.draw();
    theMatrix.translate(-rotatedLightPos);
}
