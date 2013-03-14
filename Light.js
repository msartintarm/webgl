function Light() {
    this.o = new Sphere(-0.2);
    this.o2 = new Sphere(0.1);
    this.o.o.translate(lightPos);
    this.o2.o.translate([.3,.3,.3]);
}

Light.prototype.initBuffers = function(gl_) {
    this.o.initBuffers(gl_);
    this.o2.initBuffers(gl_);
}

Light.prototype.draw = function(gl_, shader_) {

    theMatrix.push();
//    mat4.mul(theMatrix.mMatrix, 
//	     theMatrix.mMatrix, 
//	     lightMatrix);
    theMatrix.mul(lightMatrix);
    this.o.draw(gl_, shader_);
//    this.o2.draw(gl_, shader_);
    theMatrix.pop();
}
