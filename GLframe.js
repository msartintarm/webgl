/*
 * Internally manages a texture and frame.
 *
 * Does more than init its objects buffers - also
 * binds a GPU frame to a texture.
 * 
 * To draw, it renders the scene and updates the texture.
 */
function GLframe(texture_num) {
    this.num = texture_num;
    this.active = GLactiveTexture();
    this.frameBuff = null;
    this.stool = new Stool();
}

GLframe.prototype.init = function(gl_) {

    this.stool.initBuffers(gl_);

    this.frameBuff = gl_.createFramebuffer();
    this.frameBuff.width = 512;
    this.frameBuff.height = 512;
    
    this.texture = gl_.createTexture();

    // don't really need this unless it's overwriting another texture
    gl_.activeTexture(gl_.TEXTURE0 + this.active);

    gl_.bindTexture(gl_.TEXTURE_2D, this.texture);
    gl_.texImage2D(gl_.TEXTURE_2D, 0, gl_.RGBA, 
		   this.frameBuff.width, this.frameBuff.height, 
		   0, gl_.RGBA, gl_.UNSIGNED_BYTE, null);
    gl_.texParameteri(gl_.TEXTURE_2D, 
		      gl_.TEXTURE_MAG_FILTER, gl_.LINEAR);
    gl_.texParameteri(gl_.TEXTURE_2D, 
		      gl_.TEXTURE_MIN_FILTER, 
		      gl_.LINEAR_MIPMAP_NEAREST);
    gl_.generateMipmap(gl_.TEXTURE_2D);

    this.renderBuff = gl_.createRenderbuffer();
    gl_.bindRenderbuffer(gl_.RENDERBUFFER, this.renderBuff);
    gl_.renderbufferStorage(gl_.RENDERBUFFER, 
			    gl_.DEPTH_COMPONENT16, 
			    this.frameBuff.width, 
			    this.frameBuff.height);

    gl_.bindFramebuffer(gl_.FRAMEBUFFER, this.frameBuff);
    gl_.framebufferTexture2D(gl_.FRAMEBUFFER, 
			     gl_.COLOR_ATTACHMENT0,
			     gl_.TEXTURE_2D, 
			     this.texture, 0);
    gl_.framebufferRenderbuffer(gl_.FRAMEBUFFER,
				gl_.DEPTH_ATTACHMENT,
				gl_.RENDERBUFFER, this.renderBuff);

    // -- check to make sure everything is init'ed -- //
    if(gl_.checkFramebufferStatus(gl_.FRAMEBUFFER) !== 
       gl_.FRAMEBUFFER_COMPLETE) {
	alert("yo, framebuffer not working dawg");
    }

    gl_.bindRenderbuffer(gl_.RENDERBUFFER, null);
    gl_.bindFramebuffer(gl_.FRAMEBUFFER, null);
    gl_.bindTexture(gl_.TEXTURE_2D, null);

    if(gl_.getParameter(gl_.CURRENT_PROGRAM) !== gl_.shader_frame) {
	gl_.useProgram(gl_.shader_frame); }


    gl_.uniform1i(gl_.getUniformLocation(
	gl_.shader_frame, "sampler0"), this.active);
};

/**
 * 1. Saves state of matrices 
 * 2. Loads matrices specific to this framebuffer into GL
 * 3. Renders scene
 * 4. Loads state of matrices
 * 5. Updates texture used by main framebuffer
 */
GLframe.prototype.drawScene = function(gl_) {

    if(gl_.getParameter(gl_.CURRENT_PROGRAM) !== gl_.shader_frame) {
	gl_.useProgram(gl_.shader_frame);
    }

    gl_.bindFramebuffer(gl_.FRAMEBUFFER, 
			this.frameBuff);
    gl_.viewportWidth = this.frameBuff.width;
    gl_.viewportHeight = this.frameBuff.height;
    gl_.viewport(0, 0, this.frameBuff.width, this.frameBuff.height);
    gl_.clear(gl_.COLOR_BUFFER_BIT | 
	      gl_.DEPTH_BUFFER_BIT);

    // 1.
    var tempMatrix1 = mat4.clone(theMatrix.pMatrix);
    var tempMatrix = mat4.clone(theMatrix.vMatrix);
    theMatrix.vMatrixChanged = true;
    theMatrix.push();

    // 2.
    theMatrix.ortho(-10, 10, -10, 10, -1000, 1000);
    mat4.identity(theMatrix.vMatrix);
    theMatrix.setViewUniforms(gl_, gl_.shader_frame);
    theMatrix.modelInit();

    // 3.
    theMatrix.translate([0,0,-10]);
    this.stool.draw(gl_);

    // 4,
    theMatrix.pop();
    mat4.copy(theMatrix.vMatrix, tempMatrix);
    mat4.copy(theMatrix.pMatrix, tempMatrix1);
    theMatrix.vMatrixChanged = true;
    theMatrix.pMatrixChanged = true;

    gl_.viewportWidth = theCanvas.canvas.width;
    gl_.viewportHeight = theCanvas.canvas.height;
    gl_.viewport(0, 0, theCanvas.canvas.width, theCanvas.canvas.height);
    gl_.bindFramebuffer(gl_.FRAMEBUFFER, null);

    // 5.
    gl_.activeTexture(gl_.TEXTURE0 + this.active);
    gl_.bindTexture(gl_.TEXTURE_2D, this.texture);
    gl_.generateMipmap(gl_.TEXTURE_2D);
//    gl_.bindTexture(gl_.TEXTURE_2D, null);
//    this.debug;
};
