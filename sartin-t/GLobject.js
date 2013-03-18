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
    this.textureData =  [];
    this.textureNum = [];

    // Quads use an index position counter
    this.indexPos = 0;

    // Toggle textures on / off
    this.enableTextures = false;

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
GLobject.prototype.addNorms = function(x,y,z) {     
    this.normData.push(x);
    this.normData.push(y);
    this.normData.push(z); }
GLobject.prototype.addPos = function(x,y,z) {
    this.posData.push(x);
    this.posData.push(y);
    this.posData.push(z); }
GLobject.prototype.addColors = function(x,y,z) {
    this.colData.push(x);
    this.colData.push(y);
    this.colData.push(z); }
GLobject.prototype.addTexture = function(x,y) {
    this.textureData.push(x);
    this.textureData.push(y); }
GLobject.prototype.addIndexes = function(x,y,z) {
    this.indexData.push(x);
    this.indexData.push(y);
    this.indexData.push(z); }

/**
 * Or, pass a vec3 
 * (only with arrays that it makes sense for)
 */
GLobject.prototype.addNormVec = 
    function(vec) { this.normData.push(vec[0]);
		    this.normData.push(vec[1]);
		    this.normData.push(vec[2]); }
GLobject.prototype.addPosVec = 
    function(vec) { this.posData.push(vec[0]);
		    this.posData.push(vec[1]);
		    this.posData.push(vec[2]); }
GLobject.prototype.addColorVec = 
    function(vec) { this.colData.push(vec[0]);
		    this.colData.push(vec[1]);
		    this.colData.push(vec[2]); }

/**
 * Sometimes, we'll have to invert the norms 
 *  of flat objects
 */
GLobject.prototype.invertNorms = function() {

    for (var i = 0; i < this.normData.length; ++i) {
	this.normData[i] = -this.normData[i];
    }
}

/** 
 *  A---C 
 *  |  /|    Two triangles: ABC and BDC
 *  |/  |     
 *  B---D
 */
GLobject.prototype.addQuadIndexes = function(a, c) {
    this.indexData.push(a);
    this.indexData.push(a+1);
    this.indexData.push(c);
    this.indexData.push(a+1);
    this.indexData.push(c+1);
    this.indexData.push(c);
}

/**
   Buffers a quadrilateral.
*/
GLobject.prototype.Quad = function(a, b, c, d) { 
    this.addPosVec(a);
    this.addPosVec(b);   
    this.addPosVec(c);   
    this.addPosVec(d);

    var temp1 = vec3.create();
    var temp2 = vec3.create();
    var normV = vec3.create();

    vec3.cross(normV, vec3.sub(temp1,b,a), vec3.sub(temp2,c,a));

    for (var i = 0; i < 4; ++i) {
	this.addNormVec(normV);
	this.addColors(.3, .5, .7);
    }
    this.addQuadIndexes(this.indexPos,
			this.indexPos + 2);
    this.indexPos += 4;
}

GLobject.prototype.initTextures = function(at, bt, ct, dt) { 
    this.addTexture(at[0], at[1]);
    this.addTexture(bt[0], bt[1]);
    this.addTexture(ct[0], ct[1]); 
    this.addTexture(dt[0], dt[1]);
}

GLobject.prototype.setTexture = function(theTexture) { 
    for(var i = 0; i < this.normData.length / 3; ++i) {
	this.textureNum[i] = theTexture;
    }
    return this;
}

/**
 * Once the arrays are full, call to 
 *  buffer WebGL with their data
 */
GLobject.prototype.initBuffers = function(gl_) {
    if(!gl_) gl_ = thisGL;
    else thisGL = gl_;
    if(!gl_) { alert("yo"); }

    this.normBuff = gl_.createBuffer();
    this.posBuff = gl_.createBuffer();
    this.colBuff = gl_.createBuffer();
    this.indexBuff = gl_.createBuffer();
    this.textureBuff = gl_.createBuffer();
    this.textureNumBuff = gl_.createBuffer();

    if(this.textureData.length >= 1) {
	this.enableTextures = true;
    } else {
	var i = 0;
	var max = this.normData.length / 3;
	for(; i < max; ++i) {
	    this.textureData.push(0);
	    this.textureData.push(0);
	}
    }

    if(this.textureNum.length < 1) {
	var i = 0;
	var max = this.normData.length / 3;
	for(; i < max; ++i) {
	    this.textureNum.push(NO_TEXTURE);
	}
    }

    gl_.bindBuffer(gl_.ARRAY_BUFFER, this.normBuff);
    gl_.bufferData(gl_.ARRAY_BUFFER, 
		   new Float32Array(this.normData), 
		   gl_.STATIC_DRAW);
    this.normBuff.itemSize = 3;
    this.normBuff.numItems = 
	this.normData.length / 3;

    gl_.bindBuffer(gl_.ARRAY_BUFFER, this.posBuff);
    gl_.bufferData(gl_.ARRAY_BUFFER, 
		   new Float32Array(this.posData), 
		   gl_.STATIC_DRAW);
    this.posBuff.itemSize = 3;
    this.posBuff.numItems = 
	this.posData.length / 3;

    gl_.bindBuffer(gl_.ARRAY_BUFFER, this.colBuff);
    gl_.bufferData(gl_.ARRAY_BUFFER, 
		   new Float32Array(this.colData), 
		   gl_.STATIC_DRAW);
    this.colBuff.itemSize = 3;
    this.colBuff.numItems = this.colData.length / 3;

    gl_.bindBuffer(gl_.ARRAY_BUFFER, this.textureBuff);
    gl_.bufferData(gl_.ARRAY_BUFFER, new Float32Array(this.textureData), gl_.STATIC_DRAW);
    this.textureBuff.itemSize = 2;
    this.textureBuff.numItems = this.textureData.length/2;

    gl_.bindBuffer(gl_.ARRAY_BUFFER, this.textureNumBuff);
    gl_.bufferData(gl_.ARRAY_BUFFER, new Float32Array(this.textureNum), gl_.STATIC_DRAW);
    this.textureNumBuff.itemSize = 1;
    this.textureNumBuff.numItems = this.textureNum.length;

    gl_.bindBuffer(gl_.ELEMENT_ARRAY_BUFFER, this.indexBuff);
    gl_.bufferData(gl_.ELEMENT_ARRAY_BUFFER, 
		   new Uint16Array(this.indexData), 
		   gl_.STATIC_DRAW);
    this.indexBuff.itemSize = 1;
    this.indexBuff.numItems = this.indexData.length;
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
    for(var i = 0; i < this.posData.length; i += 3) {
	this.posData[i] += vec[0]; 
	this.posData[i+1] += vec[1]; 
	this.posData[i+2] += vec[2]; 
    }
    return this;
}

/**
 * Point to, and draw, the buffered triangles
 */
GLobject.prototype.drawBuffers = function(gl_, shader_) {

    theMatrix.setVertexUniforms(gl_, shader_);

    gl_.bindBuffer(gl_.ARRAY_BUFFER, this.normBuff);
    gl_.vertexAttribPointer(shader_.vNormA, 
			    this.normBuff.itemSize, 
			    gl_.FLOAT, false, 0, 0);
    
    gl_.bindBuffer(gl_.ARRAY_BUFFER, this.posBuff);
    gl_.vertexAttribPointer(shader_.vPosA, 
			    this.posBuff.itemSize, 
			    gl_.FLOAT, false, 0, 0);
    
    gl_.bindBuffer(gl_.ARRAY_BUFFER, this.colBuff);
    gl_.vertexAttribPointer(shader_.vColA, 
			    this.colBuff.itemSize,
			    gl_.FLOAT, false, 0, 0);

    gl_.bindBuffer(gl_.ARRAY_BUFFER, this.textureBuff);
    gl_.vertexAttribPointer(shader_.textureA, 
			    this.textureBuff.itemSize,
			    gl_.FLOAT, false, 0, 0);

    gl_.bindBuffer(gl_.ARRAY_BUFFER, this.textureNumBuff);
    gl_.vertexAttribPointer(shader_.textureNumA, 
			    this.textureNumBuff.itemSize,
			    gl_.FLOAT, false, 0, 0);

    gl_.bindBuffer(gl_.ELEMENT_ARRAY_BUFFER, this.indexBuff);
    gl_.drawElements(gl_.TRIANGLES, 
		     this.indexBuff.numItems, 
		     gl_.UNSIGNED_SHORT, 0);
};
