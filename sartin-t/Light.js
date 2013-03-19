function Light() {
    this.o = new Sphere(-0.05);
    this.o.o.translate(lightPos);
}

Light.prototype.initBuffers = function(gl_) {
    this.o.initBuffers(gl_);
}

Light.prototype.draw = function(gl_, shader_) {

    theMatrix.push();
    theMatrix.mul(theMatrix.vMatrix);
    theMatrix.mul(lightMatrix);
    this.o.draw(gl_, shader_);
    theMatrix.pop();
}
