function Light() {
    this.object = new Sphere(0.5);
}

Floor.prototype.draw = function(gl_) {
    GLmatrix.transform(rotatedLightPos);
    this.object.draw(gl_);
    GLmatrix.transform(-rotatedLightPos);
}
