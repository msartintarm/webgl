function GLmatrix() {
    this.mMatrix = mat4.create();
    this.vMatrix = mat4.create();

    this.ivMatrix = mat4.create();
    mat4.identity(this.vMatrix);
    this.pMatrix = mat4.create();
    this.r2 = Math.sqrt(2);
    this.mStack = [];
    this.inJump = false;
}

GLmatrix.prototype.perspective = function(zoom, aRatio, zNear, zFar) {
    mat4.perspective(
	this.pMatrix, zoom, aRatio, zNear, zFar); 
}

GLmatrix.prototype.modelInit = function() {
    mat4.identity(this.mMatrix);
    mat4.translate(this.mMatrix, 
		   this.mMatrix, 
		   [positionX.val,-positionY.val, 0]);
    mat4.rotate(
	this.mMatrix, 
	this.mMatrix, 
	rotateY.val * Math.PI/ 180, 
	[this.r2, this.r2, 0]);
}

GLmatrix.prototype.viewInit = function() {
}

GLmatrix.prototype.translate = function(vector) {
    mat4.translate(this.mMatrix, this.mMatrix, vector); }
GLmatrix.prototype.vTranslate = function(vector) {
    mat4.translate(this.vMatrix, this.vMatrix, vector); }
GLmatrix.prototype.translateN = function(vector) {
    mat4.translate(this.mMatrix, 
		   [-vector[0], 
		    -vector[1], 
		    -vector[2]]); }
GLmatrix.prototype.rotate = function(rads, vector) {
    mat4.rotate(this.mMatrix, this.mMatrix, rads, vector); }
GLmatrix.prototype.scale = function(vector) {
    mat4.scale(this.mMatrix, this.mMatrix, vector); }
GLmatrix.prototype.mul = function(m) {
    mat4.multiply(this.mMatrix, this.mMatrix, m); }

const lookDist = 1 / 64;
const moveDist = 1 / 2;

GLmatrix.prototype.lookUp = function() {
    mat4.rotate(this.vMatrix,
		this.vMatrix,
		lookDist * 2 * Math.PI, 
		[1, 0, 0]); 
}
GLmatrix.prototype.lookDown = function() {
    mat4.rotate(this.vMatrix,
		this.vMatrix,
		lookDist * 2 * Math.PI, 
		[-1, 0, 0]); 
}
GLmatrix.prototype.lookLeft = function() {
    mat4.rotate(this.vMatrix,
		this.vMatrix,
		lookDist * 2 * Math.PI, 
		[ 0, 1, 0]); 
}
GLmatrix.prototype.lookRight = function() {
    mat4.rotate(this.vMatrix,
		this.vMatrix,
		lookDist * 2 * Math.PI, 
		[ 0,-1, 0]); 
}

GLmatrix.prototype.moveRight = function() {
    mat4.translate(this.vMatrix,
		   this.vMatrix, [-moveDist, 0, 0]); 
}
GLmatrix.prototype.moveLeft = function() {
    mat4.translate(this.vMatrix,
		   this.vMatrix, [ moveDist, 0, 0]); 
}
GLmatrix.prototype.moveUp = function() {
    mat4.translate(this.vMatrix,
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
    mat4.translate(this.vMatrix,
		   this.vMatrix, [0, -moveDist, 0]); 
}
GLmatrix.prototype.moveForward = function() {
    mat4.translate(this.vMatrix,
		   this.vMatrix, [0, 0,-moveDist]); 
}

GLmatrix.prototype.moveBack = function() {
    mat4.translate(this.vMatrix,
		   this.vMatrix, [0, 0, moveDist]); 
}

/**
 * Input: amount of time to go up for x squares.
 */
GLmatrix.prototype.update = function() {
    const x = 0.1;
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

/**
 * Uniforms that are const over the lifetime
 *  of a shader only need to be set once.
 *
 * View / model / normal ops I got from:
http://www.songho.ca/opengl/gl_transform.html
 */
GLmatrix.prototype.setConstUniforms = function(gl_, shader_) {
    // models and lights are transformed by 
    //  inverse of viewing matrix
    var ilMatrix = mat4.create();
    mat4.invert(this.ivMatrix, this.vMatrix);
//    mat4.invert(ilMatrix, lightMatrix);

    gl_.uniformMatrix4fv(shader_.pMatU, 
			false, this.pMatrix);
    gl_.uniformMatrix4fv(shader_.vMatU, 
			false, this.ivMatrix);
    gl_.uniformMatrix4fv(shader_.lMatU, 
			 false, lightMatrix);
    gl_.uniform3fv(shader_.lightPosU, 
		   lightPos);
}

/**
 * Per-vertex uniforms must be set each time.
 */
GLmatrix.prototype.setVertexUniforms = function(gl_, shader_) {
    gl_.uniformMatrix4fv(shader_.mMatU, 
			false, this.mMatrix);
//    gl_.uniformMatrix4fv(shader_.vMatU, 
//			false, this.vMatrix);


    var nMatrix = mat4.create();   // normal
    var mvMatrix = mat4.create();  // modelview
    var imvMatrix = mat4.create(); // inverted modelview

    // perceived normals: (inverse of modelview
    //  transposed) * object normals
    mat4.mul(mvMatrix, this.ivMatrix, this.mMatrix);
//    mat4.mul(mvMatrix, this.ivMatrix, this.mMatrix);
//    mat4.invert(imvMatrix, mvMatrix);
//    mat4.invert(imvMatrix, this.mMatrix);
//    mat4.transpose(imvMatrix, imvMatrix);

    mat4.invert(nMatrix, mvMatrix);
    mat4.transpose(nMatrix, nMatrix);
    gl_.uniformMatrix4fv(shader_.nMatU, 
			false, nMatrix);
}

GLmatrix.prototype.push = function() {
    var copy = mat4.clone(this.mMatrix);
    this.mStack.push(copy);
}

GLmatrix.prototype.pop = function() {
    if (this.mStack.length == 0) {
        throw "Invalid pop"; }
    mat4.copy(this.mMatrix, this.mStack.pop());
}
