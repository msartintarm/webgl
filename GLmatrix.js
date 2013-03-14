function GLmatrix() {
    this.mMatrix = mat4.create();
    this.vMatrix = mat4.create();

    this.ivMatrix = mat4.create();
    mat4.identity(this.vMatrix);
    this.pMatrix = mat4.create();
    this.r2 = Math.sqrt(2);
    this.mStack = [];
    this.inJump = false;
    this.viewingPos = vec4.create(0,0,0,0);
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
const moveDist = 2.1;

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
    this.viewingPos = getViewPos(this.viewingPos, this.vMatrix); 
}
GLmatrix.prototype.lookRight = function() {
    mat4.rotate(this.vMatrix,
		this.vMatrix, 
		lookDist * 2 * Math.PI, 
		[ 0,-1, 0]); 
    this.viewingPos = getViewPos(this.viewingPos, this.vMatrix);
}

GLmatrix.prototype.moveRight = function() {
    var copy = mat4.clone(this.vMatrix);
    mat4.translate(
	this.vMatrix,
	this.vMatrix,
	[-moveDist, 0, 0]); 
    getViewPos(this.viewingPos, this.vMatrix);
    if(checkViewMatrix(this.viewingPos) && !priveledgedMode.val){
	mat4.copy(this.vMatrix, copy);	
    }
}
GLmatrix.prototype.moveLeft = function() {
    var copy = mat4.clone(this.vMatrix);
    mat4.translate(
	this.vMatrix,
	this.vMatrix,
	[ moveDist, 0, 0]);
    this.viewingPos = getViewPos(this.viewingPos, this.vMatrix);
    if(checkViewMatrix(this.viewingPos) && !priveledgedMode.val){
	mat4.copy(this.vMatrix, copy);	
    }
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

function getViewPos(vec, mat){
    vec4.transformMat4(vec, vec, mat);
///    var x = 0, y = 0, z = 1, w = 1;
//    vec.x = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
 //   vec.y = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
  //  vec.z = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
   // vec.w = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;
//    console.log('view pos= x:%d y:%d   z:%d',vec.x,vec.y,vec.z);
    console.log('view pos= x:%d y:%d   z:%d',vec[0],vec[1],vec[2]);
    return vec;
}

function checkViewMatrix(pos){    
    if(pos[2] >= 11) return 1;
    if(pos[0] <= -8) return 1;
    if(pos[0] >= 88) return 1;
    if(pos[2] <= -128) return 1;
    if((pos[0] >= 8 && pos[0] <= 12) && (pos[2] <= -8 && pos[2] >= -92)) return 1;
    if((pos[0] >= 28 && pos[0] <= 32) && (pos[2] <= -8 && pos[2] >= -32)) return 1;
    if((pos[0] >= 48 && pos[0] <= 52) && (pos[2] <= -28 && pos[2] >= -72)) return 1;
    if((pos[0] >= 48 && pos[0] <= 52) && (pos[2] <= -88 && pos[2] >= -112)) return 1;
    if((pos[0] >= 68 && pos[0] <= 72) && (pos[2] <= -68 && pos[2] >= -112)) return 1;
    if((pos[0] >= 68 && pos[0] <= 72) && (pos[2] <= -8 && pos[2] >= -52)) return 1;
    if((pos[0] >= 28 && pos[0] <= 52) && (pos[2] <= -28 && pos[2] >= -32)) return 1;
    if((pos[0] >= 8 && pos[0] <= 32) && (pos[2] <= -48 && pos[2] >= -52)) return 1;
    if((pos[0] >= 28 && pos[0] <= 72) && (pos[2] <= -68 && pos[2] >= -72)) return 1;
    if((pos[0] >= 8 && pos[0] <= 52) && (pos[2] <= -88 && pos[2] >= -92)) return 1;
    if((pos[0] >= 68 && pos[0] <= 92) && (pos[2] <= -88 && pos[2] >= -92)) return 1;
    if((pos[0] >= -8 && pos[0] <= 52) && (pos[2] <= -108 && pos[2] >= -112)) return 1;
    
    //return value of 1 means we cannot move that way
    return 0;
}

GLmatrix.prototype.moveForward = function() {
    var copy = mat4.clone(this.vMatrix);
    mat4.translate(
	this.vMatrix,
	this.vMatrix, 
	[0, 0, -moveDist]); 
    this.viewingPos = getViewPos(this.viewingPos, this.vMatrix);
    if(checkViewMatrix(this.viewingPos) && !priveledgedMode.val){
	mat4.copy(this.vMatrix, copy);	
    }
}

GLmatrix.prototype.moveBack = function() {
    var copy = mat4.clone(this.vMatrix);
    mat4.translate(
	this.vMatrix,
	this.vMatrix, [0, 0, moveDist]); 
    this.viewingPos = getViewPos(this.viewingPos, this.vMatrix);
    if(checkViewMatrix(this.viewingPos) && !priveledgedMode.val){
	mat4.copy(this.vMatrix, copy);	
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
