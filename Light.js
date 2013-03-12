function Light() {
    this.o = new Sphere(-0.2);
}

Light.prototype.initBuffers = function(gl_) {
    this.o.initBuffers(gl_);
}

Light.prototype.draw = function(gl_, shader_) {

    theMatrix.push();
    theMatrix.translate(rotatedLightPos);
    this.o.draw(gl_, shader_);
    theMatrix.pop();
}
