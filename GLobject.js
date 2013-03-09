/**
 * GLobject abstracts away buffers and arrays of data, 
 *  allowing us to work at a high level without 
 *  tripping over low-level implementation details.
 */
function GLobject() {

    // Data to load into buffers
    this.normData = [];
    this.posData = [];
    this.colData = [];
    this.indexData = [];

    // Buffers themselves
    this.normBuff = gl.createBuffer();
    this.posBuff = gl.createBuffer();
    this.colBuff = gl.createBuffer();
    this.indexBuff = gl.createBuffer();

    // Position / scale / rotation data for this object
    // X-Y-Z position to translate
    this.position = [0,0,0];
    // X-Y-Z coords to rotate
    this.rotation = [0,0,0];
    this.scale = 1;

    this.texture = "favicon.ico";
}

/**
 * Pass 3 numbers into the object's internal arrays
 */
GLobject.prototype.addNorms = 
    function(x,y,z) { this.normData.push3(x,y,z); }
GLobject.prototype.addPos = 
    function(x,y,z) { this.posData.push3(x,y,z); }
GLobject.prototype.addColors = 
    function(x,y,z) { this.colData.push3(x,y,z); }
GLobject.prototype.addIndexes =
    function(a,b,c) { this.indexData.push3(a,b,c); }

/**
 * Or, pass a vec3 
 * (only with arrays that it makes sense for)
 */
GLobject.prototype.addNormVec = 
    function(vec) { this.normData.pushV(vec); }
GLobject.prototype.addPosVec = 
    function(vec) { this.posData.pushV(vec); }
GLobject.prototype.addColorVec = 
    function(vec) { this.colData.pushV(vec); }

/** 
 *  A---C 
 *  |  /|    Two triangles: ABC and BDC
 *  |/  |     
 *  B---D
 */
GLobject.prototype.addQuadIndexes = function(a,b,c,d) {
    this.indexData.push3(a,b,c); 
    this.indexData.push3(b,d,c); }

/**
 * Once the arrays are full, call to 
 *  buffer WebGL with their data
 */
GLobject.prototype.initBuffers = function() {

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuff);
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array(this.normData), 
		  gl.STATIC_DRAW);
    this.normBuff.itemSize = 3;
    this.normBuff.numItems = 
	this.normData.length / 3;

    this.posBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuff);
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array(this.posData), 
		  gl.STATIC_DRAW);
    this.posBuff.itemSize = 3;
    this.posBuff.numItems = 
	this.posData.length / 3;

    this.colBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colBuff);
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array(this.colData), 
		  gl.STATIC_DRAW);
    this.colBuff.itemSize = 3;
    this.colBuff.numItems = this.colData.length / 3;

    this.indexBuff = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuff);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 
		  new Uint16Array(this.indexData), 
		  gl.STATIC_DRAW);
    this.indexBuff.itemSize = 1;
    this.indexBuff.numItems = this.indexData.length;
    this.normData = [];
    this.posData = [];
    this.colData = [];
    this.indexData = [];
}

GLobject.prototype.rotate = function(vec) {
    this.rotation[2] += vec[2]; 
    this.rotation[1] += vec[1]; 
    this.rotation[0] += vec[0]; 

}

GLobject.prototype.scale = function(number) {
    this.scale *= number; 
}

GLobject.prototype.translate = function(vec) {
    this.position[2] += vec[2]; 
    this.position[1] += vec[1]; 
    this.position[0] += vec[0]; 
}

/**
 * Point to, and draw, the buffered triangles
 */
GLobject.prototype.drawBuffers = function() {

//    theMatrix.rotate(this.rotationM, this.rotation);
//    theMatrix.translate(this.position);
//    theMatrix.scale(this.scale);

    theMatrix.translate(this.position);

    if(this.rotation[2] != 0)
	theMatrix.rotate(1, [this.rotation[2], 0, 0]);
    if(this.rotation[1] != 0)
	theMatrix.rotate(1, [0, this.rotation[1], 0]);
    if(this.rotation[0] != 0)
	theMatrix.rotate(1, [0, 0, this.rotation[0]]);

    theMatrix.scale([this.scale, this.scale, this.scale]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuff);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
			   this.normBuff.itemSize, 
			   gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuff);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			   this.posBuff.itemSize, 
			   gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colBuff);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
			   this.colBuff.itemSize,
			   gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuff);
    theMatrix.setUniforms();
    gl.drawElements(gl.TRIANGLES, 
		    this.indexBuff.numItems, 
		    gl.UNSIGNED_SHORT, 0);
};
