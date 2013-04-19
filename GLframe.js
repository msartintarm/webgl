function GLframe() {
    this.num = FRAME_BUFF;
    this.frameBuff = null;
}

GLframe.prototype.drawScene = function(gl_, shader_) {
    
    gl_.uniform1i(gl_.getUniformLocation(
	shader_, "framebufferU"), this.num);

    gl_.activeTexture(gl_.TEXTURE0 + this.num);
    gl_.bindFramebuffer(gl_.FRAMEBUFFER, 
			this.frameBuff);
    gl_.viewport(0, 0, this.frameBuff.width, this.frameBuff.height);
    gl_.clear(gl_.COLOR_BUFFER_BIT | 
	      gl_.DEPTH_BUFFER_BIT);

    theMatrix.perspective(zoom.val,
			  gl_.viewportWidth / 
			  gl_.viewportHeight,
			  0.1, 30000.0);

    theMatrix.push();
    theMatrix.translate([0,0,-10]);
    this.stool.draw(gl_, shader_);
    theMatrix.translate([0,0,10]);
    this.stool.draw(gl_, shader_);
    theMatrix.pop();

    gl_.clear(gl_.STENCIL_BUFFER_BIT);
    gl_.bindFramebuffer(gl_.FRAMEBUFFER, null);

    gl_.activeTexture(gl_.TEXTURE0 + this.num);
    gl_.bindTexture(gl_.TEXTURE_2D, this.texture);
}

GLframe.prototype.init = function(gl_) {

    this.stool = new Stool().initBuffers(gl_);

    this.frameBuff = gl_.createFramebuffer();
    this.frameBuff.width = 512;
    this.frameBuff.height = 512;
    
    this.texture = gl_.createTexture();

    gl_.activeTexture(gl_.TEXTURE0 + this.num);

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
    if(gl_.checkFramebufferStatus(gl_.FRAMEBUFFER) != 
       gl_.FRAMEBUFFER_COMPLETE) {
	alert("yo, framebuffer not working dawg");
    }

    gl_.bindRenderbuffer(gl_.RENDERBUFFER, null);
    gl_.bindFramebuffer(gl_.FRAMEBUFFER, null);
    gl_.bindTexture(gl_.TEXTURE_2D, null);

}
