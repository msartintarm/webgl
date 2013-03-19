function GLmatrix() {
    this.mMatrix = mat4.create();
    this.vMatrix = mat4.create();
    this.vMatrixNew = mat4.create();

    this.ivMatrix = mat4.create();
    mat4.identity(this.vMatrix);
    this.pMatrix = mat4.create();
    this.r2 = Math.sqrt(2);
    this.mStack = [];
    this.inJump = false;
    this.viewingPos = vec4.create();
    this.uncheckedPos = vec4.create();

    this.mMatrixChanged = false;
}

GLmatrix.prototype.perspective = function(zoom, aRatio, zNear, zFar) {
    mat4.perspective(
	this.pMatrix, zoom, aRatio, zNear, zFar); 
}

GLmatrix.prototype.modelInit = function() {
    mat4.identity(this.mMatrix);
}

GLmatrix.prototype.modelUpdate = function() {
    mat4.identity(this.mMatrix);
    mat4.translate(this.mMatrix,
		   this.mMatrix,
		   [positionX.val,-positionY.val,0]);
    mat4.rotate(
	this.mMatrix,
	this.mMatrix,
	rotateY.val * Math.PI/180,
	[this.r2, this.r2, 0]);
}

GLmatrix.prototype.viewInit = function() {
    mat4.identity(this.vMatrix);
    mat4.identity(this.vMatrixNew);
}

GLmatrix.prototype.viewMaze = function() {
    mat4.translate(this.vMatrixNew,
		   this.vMatrix, 
		   [20,2,9.0]);
    
    mat4.rotate(this.vMatrixNew,
		this.vMatrixNew,
		Math.PI, 
		[0, 1, 0]);
		
}

GLmatrix.prototype.translate = function(vector) {
    mat4.translate(this.mMatrix, this.mMatrix, vector); 
    this.mMatrixChanged = true;
}
GLmatrix.prototype.vTranslate = function(vector) {
    mat4.translate(this.vMatrixNew,
		   this.vMatrixNew, 
		   vector); }

GLmatrix.prototype.translateN = function(vector) {
    mat4.translate(this.mMatrix, 
		   this.mMatrix,
		   [-vector[0], 
		    -vector[1], 
		    -vector[2]]); 
    this.mMatrixChanged = true;
}
GLmatrix.prototype.rotate = function(rads, vector) {
    mat4.rotate(this.mMatrix, this.mMatrix, rads, vector);
    this.mMatrixChanged = true;
}
GLmatrix.prototype.scale = function(vector) {
    mat4.scale(this.mMatrix, this.mMatrix, vector); 
    this.mMatrixChanged = true;
}
GLmatrix.prototype.mul = function(m) {
    mat4.multiply(this.mMatrix, this.mMatrix, m); 
    this.mMatrixChanged = true;
}

const lookDist = 1 / 64;
const moveDist = 2.1;

GLmatrix.prototype.lookUp = function() {
    mat4.rotate(this.vMatrixNew,
		this.vMatrixNew,
		lookDist * 2 * Math.PI, 
		[1, 0, 0]); 
}

GLmatrix.prototype.lookDown = function() {
    mat4.rotate(this.vMatrixNew,
		this.vMatrixNew,
		lookDist * 2 * Math.PI, 
		[-1, 0, 0]); 
}

GLmatrix.prototype.lookLeft = function() {
    mat4.rotate(this.vMatrixNew, 
		this.vMatrixNew,
		lookDist * 2 * Math.PI, 
		[ 0, 1, 0]);
}

GLmatrix.prototype.lookRight = function() {
    mat4.rotate(this.vMatrixNew,
		this.vMatrixNew, 
		lookDist * 2 * Math.PI, 
		[ 0,-1, 0]); 
}

GLmatrix.prototype.moveRight = function() {
    mat4.translate(
	this.vMatrixNew,
	this.vMatrixNew,
	[-moveDist, 0, 0]); 
}

GLmatrix.prototype.moveLeft = function() {
    mat4.translate(
	this.vMatrixNew,
	this.vMatrixNew,
	[ moveDist, 0, 0]);
}

GLmatrix.prototype.moveUp = function() {
    mat4.translate(this.vMatrixNew,
 		   this.vMatrixNew,
		   [0, moveDist, 0]); 
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
    mat4.translate(this.vMatrixNew,
		   this.vMatrixNew,
		   [0, -moveDist, 0]); 
}

GLmatrix.prototype.getPosition = function() {
    var thePos = vec4.fromValues(0,0,0,1);
    vec4.transformMat4(thePos, thePos, this.vMatrix);
    return thePos;
}

GLmatrix.prototype.newViewIllegal = function() {
    var pos = vec4.fromValues(0,0,1,1);
    vec4.transformMat4(pos, pos, this.vMatrix);

    return 0;

    //return myMaze.getBound(pos);
    
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
    mat4.translate(
	this.vMatrixNew,
	this.vMatrixNew,
	[0, 0, -moveDist]); 
}

GLmatrix.prototype.moveBack = function() {
    mat4.translate(
	this.vMatrixNew,
	this.vMatrixNew,
	[0, 0, moveDist]); 
}

/**
 * Input: amount of time to go up for x squares.
 */
GLmatrix.prototype.update = function() {
    const x = 0.1;
    if(this.inJump == false) {
	if( priveledgedMode.val || !this.newViewIllegal()){
	    mat4.copy(this.vMatrix, this.vMatrixNew);
	}
	mat4.mul(this.vMatrix, 
		 this.vMatrix,
		 this.vMatrixNew);
	this.viewingPos = this.getPosition();
	mat4.identity(this.vMatrixNew);
	return; 
    }
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
			else { this.inJump = false; return; }
		    }}}}}   
    mat4.mul(this.vMatrix, this.vMatrixNew);
}

/**
 * Uniforms that are const over the lifetime
 *  of a shader only need to be set once.
*/
GLmatrix.prototype.setConstUniforms = function(gl_, shader_) {

    gl_.uniform1i(shader_.woodU, WOOD_TEXTURE);
    gl_.uniform1i(shader_.heavenU, HEAVEN_TEXTURE);
    gl_.uniform1i(shader_.hellU, HELL_TEXTURE);
    gl_.uniform1i(shader_.floorU, FLOOR_TEXTURE);
    gl_.uniform1i(shader_.operaU, OPERA_TEXTURE);
    gl_.uniform1i(shader_.brickU, BRICK_TEXTURE);
    gl_.uniform1i(shader_.tileU, TILE_TEXTURE);
    gl_.uniform1i(shader_.noU, NO_TEXTURE);
/*    gl_.activeTexture(gl_.TEXTURE0);
    gl_.bindTexture(gl_.TEXTURE_2D, woodTexture);
    gl_.activeTexture(gl_.TEXTURE1);
    gl_.bindTexture(gl_.TEXTURE_2D, heavenTexture);
    gl_.activeTexture(gl_.TEXTURE2);
    gl_.bindTexture(gl_.TEXTURE_2D, hellTexture);
    gl_.activeTexture(gl_.TEXTURE3);
    gl_.bindTexture(gl_.TEXTURE_2D, floorTexture);
    gl_.activeTexture(gl_.TEXTURE4);
    gl_.bindTexture(gl_.TEXTURE_2D, operaTexture);
    gl_.activeTexture(gl_.TEXTURE5);
    gl_.bindTexture(gl_.TEXTURE_2D, brickTexture);
    gl_.activeTexture(gl_.TEXTURE6);
    gl_.bindTexture(gl_.TEXTURE_2D, tileTexture);

    // Default to wood
    gl_.uniform1i(shader_.samplerUniform, 0);
*/
}

/**
 * View / model / normal ops I got from:
 http://www.songho.ca/opengl/gl_transform.html
*/
GLmatrix.prototype.setViewUniforms = function(gl_, shader_) {
    // models and lights are transformed by 
    //  inverse of viewing matrix
    var ilMatrix = mat4.create();
    mat4.invert(this.ivMatrix, this.vMatrix);

    gl_.uniformMatrix4fv(shader_.pMatU, 
			 false, this.pMatrix);
    gl_.uniformMatrix4fv(shader_.vMatU, 
			 false, this.ivMatrix);

    mat4.mul(ilMatrix, this.vMatrix, lightMatrix);
    gl_.uniformMatrix4fv(shader_.lMatU, 
			 false, ilMatrix);
    gl_.uniform3fv(shader_.lightPosU, 
		   lightPos);
}


var nMatrix = mat4.create();   // normal
var mvMatrix = mat4.create();  // modelview

/**
 * Per-vertex uniforms must be set each time.
 */
GLmatrix.prototype.setVertexUniforms = function(gl_, shader_) {
    if (!this.mMatrixChanged) { return; }
    gl_.uniformMatrix4fv(shader_.mMatU, 
			 false, this.mMatrix);
    // perceived normals: (inverse of modelview
    //  transposed) * object normals
    mat4.mul(mvMatrix, this.ivMatrix, this.mMatrix);

    mat4.invert(nMatrix, mvMatrix);
    mat4.transpose(nMatrix, nMatrix);
    gl_.uniformMatrix4fv(shader_.nMatU, 
			 false, nMatrix);
    this.mMatrixChanged = false;
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
