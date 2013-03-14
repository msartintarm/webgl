function GLmatrix() {
    this.mMatrix = mat4.create();
    this.vMatrix = mat4.create();
    mat4.identity(this.vMatrix);
    this.pMatrix = mat4.create();
    this.travelMatrix = mat4.create();
    mat4.identity(this.travelMatrix);
    this.r2 = Math.sqrt(2);
    this.mStack = [];
    this.inJump = false;
    this.viewingPos = new vec4(0,0,0,0);
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
GLmatrix.prototype.vTranslate = function(vector) {
    mat4.translate(this.vMatrix, vector); }
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
const moveDist = 2.1;

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
    this.viewingPos = getViewPos(this.viewingPos, this.vMatrix); 
}
GLmatrix.prototype.lookRight = function() {
    this.vMatrix = mat4.rotate(this.vMatrix, 
			       lookDist * 2 * Math.PI, 
			       [ 0,-1, 0]); 
    this.viewingPos = getViewPos(this.viewingPos, this.vMatrix);
}

GLmatrix.prototype.moveRight = function() {
    var copy = mat4.create();
    mat4.set(this.vMatrix, copy);
    this.vMatrix = mat4.translate(
	this.vMatrix, [-moveDist, 0, 0]); 
    getViewPos(this.viewingPos, this.vMatrix);
    if(checkViewMatrix(this.viewingPos) && !priveledgedMode.val){
	mat4.set(copy, this.vMatrix);	
    }
}
GLmatrix.prototype.moveLeft = function() {
    var copy = mat4.create();
    mat4.set(this.vMatrix, copy);
    this.vMatrix = mat4.translate(
	this.vMatrix, [ moveDist, 0, 0]);
    this.viewingPos = getViewPos(this.viewingPos, this.vMatrix);
    if(checkViewMatrix(this.viewingPos) && !priveledgedMode.val){
	mat4.set(copy, this.vMatrix);	
    }
}
GLmatrix.prototype.moveUp = function() {
    this.vMatrix = mat4.translate(
 	this.vMatrix, [0, moveDist, 0]); 
}
GLmatrix.prototype.jump = function() {
    this.up3 = 2;
    this.up2 = 4;
    this.up1 = 7;
    this.dn1 = 7;
    this.dn2 = 4;
    this.dn3 = 2;
    this.inJump = true;
}
GLmatrix.prototype.moveDown = function() {
    this.vMatrix = mat4.translate(
	this.vMatrix, [0, -moveDist, 0]); 
}

function getViewPos(vec, mat){
    var x = 0, y = 0, z = 1, w = 1;
    vec.x = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
    vec.y = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
    vec.z = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
    vec.w = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;
    console.log('view pos= x:%d y:%d   z:%d',vec.x,vec.y,vec.z);
    return vec;
}

function checkViewMatrix(pos){    
    if(pos.z >= 11) return 1;
    if(pos.x <= -8) return 1;
    if(pos.x >= 88) return 1;
    if(pos.z <= -128) return 1;
    if((pos.x >= 8 && pos.x <= 12) && (pos.z <= -8 && pos.z >= -92)) return 1;
    if((pos.x >= 28 && pos.x <= 32) && (pos.z <= -8 && pos.z >= -32)) return 1;
    if((pos.x >= 48 && pos.x <= 52) && (pos.z <= -28 && pos.z >= -72)) return 1;
    if((pos.x >= 48 && pos.x <= 52) && (pos.z <= -88 && pos.z >= -112)) return 1;
    if((pos.x >= 68 && pos.x <= 72) && (pos.z <= -68 && pos.z >= -112)) return 1;
    if((pos.x >= 68 && pos.x <= 72) && (pos.z <= -8 && pos.z >= -52)) return 1;
    if((pos.x >= 28 && pos.x <= 52) && (pos.z <= -28 && pos.z >= -32)) return 1;
    if((pos.x >= 8 && pos.x <= 32) && (pos.z <= -48 && pos.z >= -52)) return 1;
    if((pos.x >= 28 && pos.x <= 72) && (pos.z <= -68 && pos.z >= -72)) return 1;
    if((pos.x >= 8 && pos.x <= 52) && (pos.z <= -88 && pos.z >= -92)) return 1;
    if((pos.x >= 68 && pos.x <= 92) && (pos.z <= -88 && pos.z >= -92)) return 1;
    if((pos.x >= -8 && pos.x <= 52) && (pos.z <= -108 && pos.z >= -112)) return 1;
    
    //return value of 1 means we cannot move that way
    return 0;
}

GLmatrix.prototype.moveForward = function() {
    var copy = mat4.create();
    mat4.set(this.vMatrix, copy);
    this.vMatrix = mat4.translate(
	this.vMatrix, [0, 0, -moveDist]); 
    this.viewingPos = getViewPos(this.viewingPos, this.vMatrix);
    if(checkViewMatrix(this.viewingPos) && !priveledgedMode.val){
	mat4.set(copy, this.vMatrix);	
    }
}

GLmatrix.prototype.moveBack = function() {
    var copy = mat4.create();
    mat4.set(this.vMatrix, copy);
    this.vMatrix = mat4.translate(
	this.vMatrix, [0, 0, moveDist]); 
    this.viewingPos = getViewPos(this.viewingPos, this.vMatrix);
    if(checkViewMatrix(this.viewingPos) && !priveledgedMode.val){
	mat4.set(copy, this.vMatrix);	
    }
}

/**
 * Input: amount of time to go up for x squares.
 */
GLmatrix.prototype.update = function() {
    const x = 0.1;
    this.viewingPos = getViewPos(this.viewingPos, this.vMatrix);
    if(this.inJump == false) { return; }
    if(this.up3-- >= 0) { this.vTranslate([0, 3*x, 0]); } 
    else {
    if(this.up2-- >= 0) { this.vTranslate([0, 2*x, 0]); }
    else {
    if(this.up1-- >= 0) { this.vTranslate([0, 1*x, 0]); }
    else {
    if(this.dn1-- >= 0) { this.vTranslate([0,-1*x, 0]); }
    else {
    if(this.dn2-- >= 0) { this.vTranslate([0,-2*x, 0]); }
    else {
    if(this.dn3-- >= 0) { this.vTranslate([0,-3*x, 0]); }
    else { this.inJump = false; }
}}}}}}

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
