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

GLmatrix.prototype.modelInit = function() {
    mat4.identity(this.mMatrix);
    mat4.translate(this.mMatrix, [positionX.val,-positionY.val, 0]);
    mat4.rotate(
	this.mMatrix, 
	rotateY.val * Math.PI/ 180, 
	[this.r2, this.r2, 0]);
}

GLmatrix.prototype.viewInit = function() {
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
GLmatrix.prototype.translateN = function(vector) {
    mat4.translate(this.mMatrix, 
		   [-vector[2], 
		    -vector[1], 
		    -vector[0]]); }
GLmatrix.prototype.rotate = function(rads, vector) {
    mat4.rotate(this.mMatrix, rads, vector); }
GLmatrix.prototype.scale = function(vector) {
    mat4.scale(this.mMatrix, vector); }
GLmatrix.prototype.mult = function(m) {
    this.mMatrix = this.mMatrix.x(m); }

const lookDist = 1 / 64;
const moveDist = 1 / 2;

GLmatrix.prototype.lookUp = function() {
    this.vMatrix = mat4.rotate(this.vMatrix,
			       lookDist * 2 * Math.PI, 
			       [1, 0, 0]); 
}
GLmatrix.prototype.lookDown = function() {
    this.vMatrix = mat4.rotate(this.vMatrix, 
			       lookDist * 2 * Math.PI, 
			       [-1, 0, 0]); 
}
GLmatrix.prototype.lookLeft = function() {
    this.vMatrix = mat4.rotate(this.vMatrix, 
			       lookDist * 2 * Math.PI, 
			       [ 0, 1, 0]); 
}
GLmatrix.prototype.lookRight = function() {
    this.vMatrix = mat4.rotate(this.vMatrix, 
			       lookDist * 2 * Math.PI, 
			       [ 0,-1, 0]); 
}

GLmatrix.prototype.moveRight = function() {
    this.vMatrix = mat4.translate(
	this.vMatrix, [-moveDist, 0, 0]); 
}
GLmatrix.prototype.moveLeft = function() {
    this.vMatrix = mat4.translate(
	this.vMatrix, [ moveDist, 0, 0]); 
}
GLmatrix.prototype.moveUp = function() {
    this.vMatrix = mat4.translate(
 	this.vMatrix, [0, moveDist, 0]); 
}
GLmatrix.prototype.moveDown = function() {
    this.vMatrix = mat4.translate(
	this.vMatrix, [0, -moveDist, 0]); 
}
GLmatrix.prototype.moveForward = function() {
    this.vMatrix = mat4.translate(
	this.vMatrix, [0, 0,-moveDist]); 
}

GLmatrix.prototype.moveBack = function() {
    this.vMatrix = mat4.translate(
	this.vMatrix, [0, 0, moveDist]); 
}

// maybe this translate is faster??
GLmatrix.prototype.mvTranslate = function(v) {
    this.mult(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

GLmatrix.prototype.setUniforms = function(gl_, shader_) {
    gl_.uniformMatrix4fv(shader_.pMatU, 
			false, this.pMatrix);
    gl_.uniformMatrix4fv(shader_.mMatU, 
			false, this.mMatrix);
//    gl_.uniformMatrix4fv(shader_.vMatU, 
//			false, this.vMatrix);
    var inverseViewMatrix = mat4.create();
    mat4.inverse(this.vMatrix, inverseViewMatrix);
    gl_.uniformMatrix4fv(shader_.vMatU, 
			false, inverseViewMatrix);
    var normalMatrix = mat3.create();
    mat4.toInverseMat3(this.mMatrix, normalMatrix);
    mat3.transpose(normalMatrix, normalMatrix);
    gl_.uniformMatrix3fv(shader_.nMatU, 
			false, normalMatrix);
    gl_.uniform3fv(shader_.lightPosU, 
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
