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

    this.textureNum = null;

    // Quads use an index position counter
    this.indexPos = 0;

    // Position / scale / rotation data for this object
    // X-Y-Z position to translate
    this.position = [0,0,0];
    this.position = [0,0,0];
    // X-Y-Z coords to rotate
    this.rotation = [0,0,0];
    this.scale = 1;

    // Ensure any repeat initialization
    //  of this object's data will do it correctly
    this.normsInverted = false;
    this.hasFlatNorms = false;
}

/**
 * Pass 3 numbers into the object's internal arrays
 */
GLobject.prototype.addNorms = function(x,y,z) {     
    this.normData.push(x);
    this.normData.push(y);
    this.normData.push(z); };
GLobject.prototype.addPos = function(x,y,z) {
    this.posData.push(x);
    this.posData.push(y);
    this.posData.push(z); };
GLobject.prototype.addColors = function(x,y,z) {
    this.colData.push(x);
    this.colData.push(y);
    this.colData.push(z); };
GLobject.prototype.addTexture = function(x,y) {
    this.textureData.push(x);
    this.textureData.push(y); };
GLobject.prototype.addIndexes = function(x,y,z) {
    this.indexData.push(x);
    this.indexData.push(y);
    this.indexData.push(z); };

/**
 * Or, pass a vec3 
 * (only with arrays that it makes sense for)
 */
GLobject.prototype.addNormVec = 
    function(vec) { this.normData.push(vec[0]);
		    this.normData.push(vec[1]);
		    this.normData.push(vec[2]); };
GLobject.prototype.addPosVec = 
    function(vec) { this.posData.push(vec[0]);
		    this.posData.push(vec[1]);
		    this.posData.push(vec[2]); };
GLobject.prototype.addColorVec = 
    function(vec) { this.colData.push(vec[0]);
		    this.colData.push(vec[1]);
		    this.colData.push(vec[2]); };

/**
 * Sometimes, we'll have to invert the norms 
 *  of objects
 */
GLobject.prototype.invertNorms = function() {
    this.normsInverted = true;
    for (var i = 0; i < this.normData.length; ++i) {
	this.normData[i] = -this.normData[i];
    }
};

/**
 * Sometimes, we'll have to invert the norms 
 *  of objects
 */
GLobject.prototype.invertFlatNorms = function() {
    for (var i = 0; i < this.normData_.length; ++i) {
	this.normData_[i] = -this.normData_[i];
    }
};

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
    this.indexData.push(c+1);
    this.indexData.push(c);
    this.indexData.push(a+1);
};

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
	this.addColors(0.3, 0.5, 0.7);
    }
    this.addQuadIndexes(this.indexPos,
			this.indexPos + 2);
    this.indexPos += 4;
};

GLobject.prototype.initTextures = function(at, bt, ct, dt) { 
    this.addTexture(at[0], at[1]);
    this.addTexture(bt[0], bt[1]);
    this.addTexture(ct[0], ct[1]); 
    this.addTexture(dt[0], dt[1]);
};

/**
 *   Based upon the enumerated texture chosen,
 *   selects which lighting attributes this object
 *   will receive. 
 *
 *   These values are uniforms - the same for each vertice
*/
GLobject.prototype.setTexture = function(theTexture) { 

    this.textureNum = theTexture;
    
    // default values
    this.ambient_coeff = 0.1;
    this.diffuse_coeff = 0.7;
    this.specular_coeff = 0.0;
    this.specular_color = vec3.fromValues(0.8, 0.8, 0.8);

    switch(theTexture) {
    case HELL_TEXTURE:
	//vec3.set(this.specular_color, 0.7, 0.2, 0.2);
	this.specular_coeff = 0.0;
	this.ambient_coeff = 0.0;
	this.diffuse_coeff = 1.0;
	break;
    case FLOOR_TEXTURE:
	this.ambient_coeff = 0.2;
	this.diffuse_coeff = 0.4;
	break;
    case BRICK_TEXTURE:
	this.ambient_coeff = 0.1;
	this.diffuse_coeff = 0.2;
	
	break; 
    case TILE_TEXTURE:
	this.ambient_coeff = 0.1;
	this.diffuse_coeff = 0.3;
	break;
    case SKYBOX_TEXTURE_0:
    case SKYBOX_TEXTURE_1:
    case SKYBOX_TEXTURE_2:
    case SKYBOX_TEXTURE_3:
    case SKYBOX_TEXTURE_4:
    case SKYBOX_TEXTURE_5:
    case SKYBOX_TEXTURE_REAL:
    case TEXT_TEXTURE:
    case TEXT_TEXTURE2:
    case TEXT_TEXTURE3:
    case TEXT_TEXTURE4:
	// For certain textures, we want _no_ position-dependent lighting.
	this.ambient_coeff = 2.4;
	this.diffuse_coeff = 0.0;
	vec3.set(this.specular_color, 0.0, 0.0, 0.0);
//	this.specular_coeff = 1.0;
	break;
    case RUG_TEXTURE:
	this.ambient_coeff = 0.9;
	this.specular_coeff = 1.0;
	break;
    case FRAME_BUFF:
	this.ambient_coeff = 0.3;
	break;
    case WOOD_TEXTURE:
    case HEAVEN_TEXTURE: 
    case NO_TEXTURE:
	break;
    default:
	alert("Unsupported texture number %d in GLobject.js", theTexture);
	break;
    }
    return this;
};

/**
 *   Based upon the enumerated texture chosen,
 *   selects which lighting attributes this object
 *   will receive. 
 *
 *   These values are uniforms - the same for each vertice
*/
GLobject.prototype.setActive = function(theActive) { 
    this.active = theActive;
};

/**
 * Once the arrays are full, call to 
 *  buffer WebGL with their data
 */
GLobject.prototype.initBuffers = function(gl_) {


    if(!this.textureNum) { 
	this.setTexture(NO_TEXTURE);
	// See if we need to create 'dummy' data
	if(this.textureData.length < 1) {
	    var i, max;
	    for(i = 0, max = this.normData.length / 3; i < max; ++i) {
		this.textureData.push(0);
		this.textureData.push(0);
	    }
	}
    } else {
	// See if the texture has been created or not
	if(this.textureNum < TEXT_TEXTURE && !gl_.textureNums[this.textureNum]) {
	    gl_.textureNums[this.textureNum] = (new GLtexture(gl_, this.textureNum)).active;
	}
    }
    this.initFlatNorms();

    this.normBuff = gl_.createBuffer();
    this.posBuff = gl_.createBuffer();
    this.colBuff = gl_.createBuffer();
    this.indexBuff = gl_.createBuffer();
    this.textureBuff = gl_.createBuffer();

    // If we have flat norms, use them
    if(FLATNORMS === true) {
	this.bufferData(gl_, this.normBuff, this.normData_, 3);
	this.bufferData(gl_, this.posBuff, this.posData_, 3);
	this.bufferData(gl_, this.colBuff, this.colData_, 3);
	this.bufferData(gl_, this.textureBuff, this.textureData_, 2);
	this.bufferElements(gl_, this.indexBuff, this.indexData_);
    } else {
	this.bufferData(gl_, this.normBuff, this.normData, 3);
	this.bufferData(gl_, this.posBuff, this.posData, 3);
	this.bufferData(gl_, this.colBuff, this.colData, 3);
	this.bufferData(gl_, this.textureBuff, this.textureData, 2);
	this.bufferElements(gl_, this.indexBuff, this.indexData);
    }
};

/**
   Buffer data fpr a single vertex attribute array.
*/
GLobject.prototype.bufferData = function(gl_, theBuff, theData, theSize) {

    gl_.bindBuffer(gl_.ARRAY_BUFFER, theBuff);
    gl_.bufferData(gl_.ARRAY_BUFFER, 
		   new Float32Array(theData),
		   gl_.STATIC_DRAW);
    theBuff.itemSize = theSize; 
    theBuff.numItems = theData.length / theSize;
};

/**
   Buffer data fpr vertex elements.
*/
GLobject.prototype.bufferElements = function(gl_, theBuff, theData, theSize) {

    gl_.bindBuffer(gl_.ELEMENT_ARRAY_BUFFER, theBuff);
    gl_.bufferData(gl_.ELEMENT_ARRAY_BUFFER, 
		   new Uint16Array(theData),
		   gl_.STATIC_DRAW);
    theBuff.itemSize = 1;
    theBuff.numItems = theData.length;
};

GLobject.prototype.rotate = function(vec) {
    this.rotation[2] += vec[2]; 
    this.rotation[1] += vec[1]; 
    this.rotation[0] += vec[0]; 
};

GLobject.prototype.scale = function(num) {
    for(var i = 0; i < this.posData.length; ++i) {
	this.posData[i] *= num; 
    }
    return this;
};

GLobject.prototype.translate = function(vec) {
    for(var i = 0; i < this.posData.length; i += 3) {
	this.posData[i] += vec[0]; 
	this.posData[i+1] += vec[1]; 
	this.posData[i+2] += vec[2]; 
    }
    return this;
};

/**
   Link GL's pre-loaded attributes to the  program
   Then send the divide-and-conquer 'draw' signal to the GPU
*/
GLobject.prototype.linkAttribs = function(gl_, shader_) {



    if(ball_shader_selectG  >= kNameG.length)
	ball_shader_selectG = 0;

    gl_.uniform1fv(shader_.unis["u_kernel"], kernelsG[kNameG[ball_shader_selectG]]);
    gl_.uniform2f(shader_.unis["u_textureSize"], 1024, 1024);
    //gl_.uniform1f(shader_.unis["ballHitu"], 0.0);

    gl_.uniform1f(shader_.unis["ambient_coeff_u"], this.ambient_coeff);
    gl_.uniform1f(shader_.unis["diffuse_coeff_u"], this.diffuse_coeff);

    // check to see if texture is used in shader
    if(shader_.unis["textureNumU"] && (this.textureNum !== NO_TEXTURE)) {

	// check to see if texture is a text texture
	if(this.textureNum >= FRAME_BUFF) {
	    gl_.uniform1f(shader_.unis["textureNumU"], this.active);
	} else if (gl_.textureNums[this.textureNum]) {
	    gl_.uniform1f(shader_.unis["textureNumU"], gl_.textureNums[this.textureNum]);
	} else { 
	    if(envDEBUG) { alert("error: texture not loaded."); }
	}
    }
//    if(shader_.unis["textureNumU"] !== null && (gl_.textureNums[this.textureNum])) {
//	gl_.uniform1f(shader_.unis["textureNumU"], NO_TEXTURE);
  //  }
//    gl_.uniform1f(shader_.specular_coeff, this.specular_coeff);
if(this.specular_color) { gl_.uniform3fv(shader_.unis["specular_color_u"], this.specular_color); }

    this.linkAttrib(gl_, shader_.attribs["vNormA"], this.normBuff);
    this.linkAttrib(gl_, shader_.attribs["vPosA"], this.posBuff);
    this.linkAttrib(gl_, shader_.attribs["vColA"], this.colBuff);
    this.linkAttrib(gl_, shader_.attribs["textureA"], this.textureBuff);
};

GLobject.prototype.linkAttrib = function(gl_, gpu_attrib, cpu_attrib) {
    if(gpu_attrib !== -1) {
	gl_.bindBuffer(gl_.ARRAY_BUFFER, cpu_attrib);
	gl_.vertexAttribPointer(gpu_attrib, cpu_attrib.itemSize, gl_.FLOAT, false, 0, 0);
    }
};

/**
   Send the divide-and-conquer 'draw' signal to the GPU
   Attributes must first be linked (as above).
*/
GLobject.prototype.drawElements = function(gl_) {
    gl_.bindBuffer(gl_.ELEMENT_ARRAY_BUFFER, this.indexBuff);
    gl_.drawElements(gl_.TRIANGLES, 
        this.indexBuff.numItems, gl_.UNSIGNED_SHORT, 0);
};

/**
 * Point to, and draw, the buffered triangles
 */
GLobject.prototype.draw = function(gl_) {

    var shader_;
    if(this.textureNum === NO_TEXTURE)
	shader_ = gl_.shader_color
    else if(this.textureNum === HELL_TEXTURE)
	shader_ = gl_.shader_ball;
    else
	shader_ = gl_.shader;

    if(gl_.getParameter(gl_.CURRENT_PROGRAM) !== shader_) {
	gl_.useProgram(shader_);
    }
    theMatrix.setViewUniforms(gl_, shader_);
    theMatrix.setVertexUniforms(gl_, shader_);
    this.linkAttribs(gl_, shader_);
    this.drawElements(gl_);
};

var FLATNORMS = false;

/**
   Each quad is made up of four triangles, and hence, 
   the norms -can- be calculated solely through their
   positions. 

   All position data must be stable before this point.
*/
GLobject.prototype.initFlatNorms = function() {
    
    if(FLATNORMS === false || this.hasFlatNorms === true) return;
    this.hasFlatNorms = true;

    var a, b, c, d;
    a = vec3.create();
    b = vec3.create();
    c = vec3.create();
    d = vec3.create();

    this.indexData_ = [];
    this.normData_ = [];
    this.colData_ = [];
    this.posData_ = []; 
    this.textureData_ = [];
    // We'll go over one triangle (3 indexes, 3 * data_size elements for each new buffer)
    // This will mean the new buffers will have 3/2 as many elements
    var i = 0;
    while(i < this.indexData.length) {

	// Load up every element
	this.indexData_.push(i);
	ind = this.indexData[i];
	this.colData_.push( this.colData[ind * 3] );
	this.colData_.push( this.colData[ind * 3 + 1] );
	this.colData_.push( this.colData[ind * 3 + 2] );
	this.posData_.push( this.posData[ind * 3] );
	this.posData_.push( this.posData[ind * 3 + 1] );
	this.posData_.push( this.posData[ind * 3 + 2] );
	this.textureData_.push( this.textureData[ind * 2] );
	this.textureData_.push( this.textureData[ind * 2 + 1] );
	vec3.set(a, this.posData[ind * 3], 
		    this.posData[ind * 3 + 1], 
		    this.posData[ind * 3 + 2]); 
	i++;
	// 3 times. Only the vector that's set changes.
	this.indexData_.push(i);
	ind = this.indexData[i];
	this.colData_.push( this.colData[ind * 3] );
	this.colData_.push( this.colData[ind * 3 + 1] );
	this.colData_.push( this.colData[ind * 3 + 2] );
	this.posData_.push( this.posData[ind * 3] );
	this.posData_.push( this.posData[ind * 3 + 1] );
	this.posData_.push( this.posData[ind * 3 + 2] );
	this.textureData_.push( this.textureData[ind * 2] );
	this.textureData_.push( this.textureData[ind * 2 + 1] );
	vec3.set(b, this.posData[ind * 3], 
		    this.posData[ind * 3 + 1], 
		    this.posData[ind * 3 + 2]); 
	i++;
	// Last time.
	this.indexData_.push(i);
	ind = this.indexData[i];
	this.colData_.push( this.colData[ind * 3] );
	this.colData_.push( this.colData[ind * 3 + 1] );
	this.colData_.push( this.colData[ind * 3 + 2] );
	this.posData_.push( this.posData[ind * 3] );
	this.posData_.push( this.posData[ind * 3 + 1] );
	this.posData_.push( this.posData[ind * 3 + 2] );
	this.textureData_.push( this.textureData[ind * 2] );
	this.textureData_.push( this.textureData[ind * 2 + 1] );
	vec3.set(c, this.posData[ind * 3], 
		    this.posData[ind * 3 + 1], 
		    this.posData[ind * 3 + 2]); 
	i++;
	// Calc norms for these 3 triangles.
	vec3.sub(b, b, a);
	vec3.sub(c, c, a);
	vec3.cross(c, c, b);
	vec3.normalize(c, c);

	this.normData_.push(c[0]);
	this.normData_.push(c[1]);
	this.normData_.push(c[2]);
	this.normData_.push(c[0]);
	this.normData_.push(c[1]);
	this.normData_.push(c[2]);
	this.normData_.push(c[0]);
	this.normData_.push(c[1]);
	this.normData_.push(c[2]);
    }

    if(this.normsInverted) { this.invertFlatNorms(); }

};
