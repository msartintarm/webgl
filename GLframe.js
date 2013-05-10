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
    theCanvas.gl.tex_enum[this.num] = -1;
    this.frameBuff = null;
    this.stool = new Stool();
}

GLframe.prototype.init = function(gl_) {

    this.stool.setShader(gl_.shader_frame);

    this.stool.initBuffers(gl_);

    this.frameBuff = gl_.createFramebuffer();
    this.frameBuff.width = 512;
    this.frameBuff.height = 512;

    this.active = gl_.active++;
    
    this.texture = gl_.createTexture();

    // don't really need this unless it's overwriting another texture
    gl_.activeTexture(gl_.TEXTURE0 + this.active);

    gl_.bindTexture(gl_.TEXTURE_2D, this.texture);
    gl_.texParameteri(gl_.TEXTURE_2D, 
		      gl_.TEXTURE_MAG_FILTER, gl_.LINEAR);
    gl_.texParameteri(gl_.TEXTURE_2D, 
		      gl_.TEXTURE_MIN_FILTER, 
		      gl_.LINEAR_MIPMAP_LINEAR);
    gl_.texImage2D(gl_.TEXTURE_2D, 0, gl_.RGBA, 
		   this.frameBuff.width, this.frameBuff.height, 
		   0, gl_.RGBA, gl_.UNSIGNED_BYTE, null);
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

    theCanvas.changeShader(gl_.shader);

    var sampler_num = gl_.shader.sampler ++;
    theCanvas.gl.tex_enum[this.num] = this.active;

    gl_.uniform1i(gl_.getUniformLocation(
	gl_.shader, "sampler" + sampler_num), this.active);
    console.log("frame: [" + this.active + "," + sampler_num + "," + this.num + "]");
};

/**
 * 1. Saves state of matrices 
 * 2. Loads matrices specific to this framebuffer into GL
 * 3. Renders scene
 * 4. Loads state of matrices
 * 5. Updates texture used by main framebuffer
 */

var every_other = 0;
GLframe.prototype.drawScene = function(gl_) {
    if((every_other++) % 2 === 0) return;

    theCanvas.changeShader(gl_.shader);

    gl_.activeTexture(gl_.TEXTURE0 + this.active);
    gl_.viewportWidth = this.frameBuff.width;
    gl_.viewportHeight = this.frameBuff.height;
    gl_.viewport(0, 0, this.frameBuff.width, this.frameBuff.height);
    gl_.bindTexture(gl_.TEXTURE_2D, null);
    gl_.bindFramebuffer(gl_.FRAMEBUFFER, 
			this.frameBuff);
    gl_.clear(gl_.COLOR_BUFFER_BIT | 
	      gl_.DEPTH_BUFFER_BIT);

    // 1.
    var tempMatrix1 = mat4.clone(theMatrix.pMatrix);
    var tempMatrix = mat4.clone(theMatrix.vMatrix);
    theMatrix.push();

    // 2.
    theMatrix.ortho(-10, 10, -10, 10, -1000, 1000);
    mat4.identity(theMatrix.vMatrix);
    theMatrix.vMatrixChanged = true;
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

    gl_.bindFramebuffer(gl_.FRAMEBUFFER, null);
    gl_.clear(gl_.COLOR_BUFFER_BIT | 
	      gl_.DEPTH_BUFFER_BIT);
    gl_.bindTexture(gl_.TEXTURE_2D, this.texture);
    gl_.generateMipmap(gl_.TEXTURE_2D);
    gl_.viewport(0, 0, theCanvas.canvas.width, theCanvas.canvas.height);

    // 5.
//    gl_.bindTexture(gl_.TEXTURE_2D, null);
//    this.debug;
};
