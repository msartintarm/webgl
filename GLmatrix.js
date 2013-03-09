function GLmatrix() {
    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
    this.travelMatrix = mat4.create();
    mat4.identity(this.travelMatrix);
    this.r2 = Math.sqrt(2);
    this.mvStack = [];
}

GLmatrix.prototype.perspective = function(zoom, zNear, zFar) {
    mat4.perspective(zoom, 
		     gl.viewportWidth / gl.viewportHeight,
		     zNear, zFar, this.pMatrix); 
}

GLmatrix.prototype.modelview = function() {
    mat4.identity(this.mvMatrix);
    mat4.translate(this.mvMatrix, [0, 0,-6]);
    mat4.translate(this.mvMatrix, [positionX.val,-positionY.val, 0]);
    mat4.rotate(
	this.mvMatrix, 
	rotateY.val * Math.PI/ 180, 
	[this.r2, this.r2, 0]);
}

GLmatrix.prototype.calcViewer = function() {
    rotatedLightPos =
	[-Math.sin(rotateCam.val * Math.PI/ 180) / this.r2,
	 1 / this.r2,
	 Math.cos(rotateCam.val * Math.PI/ 180) / this.r2];

    rotatedViewPos = [
	-Math.sin(rotateY.val * Math.PI/ 180) / this.r2,
	Math.sin(rotateY.val * Math.PI/ 180) / this.r2,
	Math.cos(rotateY.val * Math.PI/ 180)];
}

GLmatrix.prototype.translate = function(vector) {
    mat4.translate(this.mvMatrix, vector); }
GLmatrix.prototype.rotate = function(rads, vector) {
    mat4.rotate(this.mvMatrix, rads, vector); }
GLmatrix.prototype.scale = function(vector) {
    mat4.scale(this.mvMatrix, vector); }
GLmatrix.prototype.mult = function(m) {
    this.mvMatrix = this.mvMatrix.x(m); }

const moveDist = 1;

GLmatrix.prototype.moveRight = function() {
    positionX.incBy(1);
    this.travelMatrix = mat3.transpose([moveDist, 0, 0]); }
GLmatrix.prototype.moveLeft = function() {
    positionX.incBy(-1);
    this.travelMatrix = mat3.transpose([-moveDist, 0, 0]); }
GLmatrix.prototype.moveUp = function() {
    positionY.incBy(1); }
GLmatrix.prototype.moveDown = function() {
    positionY.incBy(-1); }

// maybe this translate is faster??
GLmatrix.prototype.mvTranslate = function(v) {
    this.mult(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

GLmatrix.prototype.setUniforms = function() {
//    mat4.multiply(this.travelMatrix, this.mvMatrix);
//    mat4.multiply(this.mvMatrix, this.travelMatrix);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, 
			false, this.pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, 
			false, this.mvMatrix);
    var normalMatrix = mat3.create();
    mat4.toInverseMat3(this.mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, 
			false, normalMatrix);
    gl.uniform3fv(shaderProgram.lightPositionUniform, 
		  rotatedLightPos);
    gl.uniform3fv(shaderProgram.viewPositionUniform, 
		  rotatedViewPos);
}

GLmatrix.prototype.push = function() {
    var copy = mat4.create();
    mat4.set(this.mvMatrix, copy);
    this.mvStack.push(copy);
}

GLmatrix.prototype.pop = function() {
    if (this.mvStack.length == 0) {
        throw "Invalid pop"; }
    mat4.set(this.mvStack.pop(), this.mvMatrix);
}
