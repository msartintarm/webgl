function Light() {
    this.o = new Sphere(0.5);
}

Light.prototype.initBuffers = function(gl_) {
    this.o.initBuffers(gl_);
}

Light.prototype.draw = function(gl_, shader_) {

/*
    theMatrix.translateN(rotatedLightPos);
    theMatrix.translateN(rotatedLightPos);
    theMatrix.translateN(rotatedLightPos);
    theMatrix.translateN(rotatedLightPos);
    theMatrix.translateN(rotatedLightPos);
    this.o.draw(gl_, shader_);
    theMatrix.translate(rotatedLightPos);
    theMatrix.translate(rotatedLightPos);
    theMatrix.translate(rotatedLightPos);
    theMatrix.translate(rotatedLightPos);
    theMatrix.translate(rotatedLightPos);
*/
}
