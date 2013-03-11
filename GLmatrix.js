function GLmatrix() {
    this.mMatrix = mat4.create();
    this.vMatrix = mat4.create();
    mat4.identity(this.vMatrix);
    this.pMatrix = mat4.create();
    this.travelMatrix = mat4.create();
    mat4.identity(this.travelMatrix);
    this.r2 = Math.sqrt(2);
    this.mStack = [];
}

GLmatrix.prototype.perspective = function(zoom, aRatio, zNear, zFar) {
    mat4.perspective(
	zoom, aRatio, zNear, zFar, this.pMatrix); 
}

GLmatrix.prototype.modelview = function() {
    mat4.identity(this.mMatrix);
    mat4.translate(this.mMatrix, [0, 0,-6]);
    mat4.translate(this.mMatrix, [positionX.val,-positionY.val, 0]);
    mat4.rotate(
	this.mMatrix, 
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
    mat4.translate(this.mMatrix, vector); }
GLmatrix.prototype.rotate = function(rads, vector) {
    mat4.rotate(this.mMatrix, rads, vector); }
GLmatrix.prototype.scale = function(vector) {
    mat4.scale(this.mMatrix, vector); }
GLmatrix.prototype.mult = function(m) {
    this.mMatrix = this.mMatrix.x(m); }

const moveDist = 1;

GLmatrix.prototype.lookUp = function() {
    this.vMatrix = mat4.rotate(this.vMatrix, 
			       moveDist * Math.PI / 16, 
			       [1, 0, 0]); 
}
GLmatrix.prototype.lookDown = function() {
    this.vMatrix = mat4.rotate(this.vMatrix, 
			       moveDist * Math.PI / 16, 
			       [-1, 0, 0]); 
}
GLmatrix.prototype.lookLeft = function() {
    this.vMatrix = mat4.rotate(this.vMatrix, 
			       moveDist * Math.PI / 16, 
			       [ 0,-1, 0]); 
}
GLmatrix.prototype.lookRight = function() {
    this.vMatrix = mat4.rotate(this.vMatrix, 
			       moveDist * Math.PI / 16, 
			       [ 0, 1, 0]); 
}

GLmatrix.prototype.moveRight = function() {
    this.vMatrix = mat4.translate(this.vMatrix, [moveDist, 0, 0]); 
}
GLmatrix.prototype.moveLeft = function() {
    this.vMatrix = mat4.translate(this.vMatrix, [-moveDist, 0, 0]); 
}
GLmatrix.prototype.moveUp = function() {
    this.vMatrix = mat4.translate(this.vMatrix, [0, moveDist, 0]); 
}
GLmatrix.prototype.moveDown = function() {
    this.vMatrix = mat4.translate(this.vMatrix, [0, -moveDist, 0]); 
}

// maybe this translate is faster??
GLmatrix.prototype.mvTranslate = function(v) {
    this.mult(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

GLmatrix.prototype.setUniforms = function(gl_) {
//    mat4.multiply(this.travelMatrix, this.mvMatrix);
//    mat4.multiply(this.mvMatrix, this.travelMatrix);
    gl_.uniformMatrix4fv(shaders.pMatU, 
			false, this.pMatrix);
    gl_.uniformMatrix4fv(shaders.mMatU, 
			false, this.mMatrix);
    gl_.uniformMatrix4fv(shaders.vMatU, 
			false, this.vMatrix);
    var normalMatrix = mat3.create();
    mat4.toInverseMat3(this.mMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl_.uniformMatrix3fv(shaders.nMatU, 
			false, normalMatrix);
    gl_.uniform3fv(shaders.lightPosU, 
		  rotatedLightPos);
}

GLmatrix.prototype.push = function() {
    var copy = mat4.create();
    mat4.set(this.mMatrix, copy);
    this.mStack.push(copy);
}

GLmatrix.prototype.pop = function() {
    if (this.mStack.length == 0) {
        throw "Invalid pop"; }
    mat4.set(this.mStack.pop(), this.mMatrix);
}
