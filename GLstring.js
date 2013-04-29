var nextSamplerString = 18;
function GLstringSampler() {
    return nextSamplerString++;
}

/**
   Creates a texture and fills it with the contents of a string.
   'theStr ing.texture_num' should be used externally to find
   the texture to set
 */
function GLstring(text_to_write) {
    this.active = GLactiveTexture();
    this.texture_num = GLstringSampler();
    this.text = text_to_write;
    this.canvas = document.getElementById('textureCanvas');
    this.text_size = 112;
    return this;
}

GLstring.prototype.initBuffers = function(gl_) {

    if(!this.texture) this.texture = gl_.createTexture();

    var textSize = 112;

    var ctx = this.canvas.getContext("2d");
    if(!ctx) { alert("Error initializing text."); }

    ctx.font = textSize + "px Arial";
    this.canvas.width = Math.pow(2,
	Math.ceil(Math.log(ctx.measureText(this.text).width) / Math.LN2));
    this.canvas.height = Math.pow(2,
	Math.ceil(Math.log(textSize) / Math.LN2));

    ctx.font = textSize + "px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "#123456";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.canvas.width/2, this.canvas.height/2);
    ctx.fillStyle = "#423518";
    ctx.fillText(this.text, this.canvas.width/2 + 1, this.canvas.height/2 + 1);
    ctx.fillStyle = "#127596";
    ctx.fillText(this.text, this.canvas.width/2 + 2, this.canvas.height/2 + 2);
    ctx.fillStyle = "#112233";
    ctx.fillText(this.text, this.canvas.width/2 + 3, this.canvas.height/2 + 3);

    var sampler =
    gl_.getUniformLocation(gl_.shader, "sampler" + this.texture_num);
    gl_.uniform1i(sampler, this.active);

    gl_.activeTexture(gl_.TEXTURE0 + this.active);
    gl_.bindTexture(gl_.TEXTURE_2D, this.texture);

    gl_.texParameteri(gl_.TEXTURE_2D, 
			  gl_.TEXTURE_WRAP_S, 
			  gl_.CLAMP_TO_EDGE);
    gl_.texParameteri(gl_.TEXTURE_2D, 
			  gl_.TEXTURE_WRAP_T, 
			  gl_.CLAMP_TO_EDGE);
    gl_.texImage2D(gl_.TEXTURE_2D, 0, gl_.RGBA, gl_.RGBA, 
		       gl_.UNSIGNED_BYTE, this.canvas);
    gl_.texParameteri(gl_.TEXTURE_2D, gl_.TEXTURE_MAG_FILTER, gl_.LINEAR);
    gl_.texParameteri(gl_.TEXTURE_2D, gl_.TEXTURE_MIN_FILTER, gl_.LINEAR_MIPMAP_NEAREST);

    gl_.texParameteri(gl_.TEXTURE_2D, gl_.TEXTURE_MIN_FILTER, gl_.LINEAR);
    gl_.generateMipmap(gl_.TEXTURE_2D);
};

GLstring.prototype.draw = function(gl_) { return; }
