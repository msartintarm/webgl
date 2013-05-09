/**
   Creates a texture and fills it with the contents of a string.
   'theStr ing.texture_num' should be used externally to find
   the texture to set
 */
function GLstring(text_to_write, string_num) {
    this.text = text_to_write;
    this.canvas = document.getElementById('textureCanvas');
    this.num = string_num;
    theCanvas.gl.tex_enum[this.num] = -1;
    return this;
}

GLstring.prototype.initBuffers = function(gl_) {

    if(!this.texture) this.texture = gl_.createTexture();

    var ctx = this.canvas.getContext("2d");
    if(!ctx) { alert("Error initializing text."); }

    var textSize = 112;
    ctx.font = textSize + "px Arial";

	// Use logs to round the text width and height to the nearest power of 2
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

    if(gl_.getParameter(gl_.CURRENT_PROGRAM) !== gl_.shader) {
	gl_.useProgram(gl_.shader);
    }

    var sampler_num = gl_.shader.sampler ++;
    var active_num = gl_.active ++;

    var gl_sampler = gl_.getUniformLocation(
	gl_.shader, "sampler" + sampler_num);
    gl_.tex_enum[this.num] = active_num;
    gl_.uniform1i(gl_sampler, active_num);

    gl_.activeTexture(gl_.TEXTURE0 + active_num);
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
    
    console.log("str:[" + active_num + "," + 
		sampler_num + "," + this.num + "]");
    document.getElementById("glcanvas_status").innerHTML += 
    "str:[" + active_num + "," + sampler_num + "," + this.num + "]</br>";
    
};

GLstring.prototype.draw = function(gl_) { return; };
