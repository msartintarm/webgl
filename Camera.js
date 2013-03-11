function Light() {
    this.object = new Sphere(0.5);
}

Floor.prototype.draw = function() {
    GLmatrix.transform(rotatedLightPos);
    this.object.draw();
    GLmatrix.transform(-rotatedLightPos);
}
