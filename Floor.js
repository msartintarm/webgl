/**
b d
a c           
 */
function Floor() {     
    //floor
    this.a = new vec3(-10,0,-10);
    this.b = new vec3(-10,0,10);
    this.c = new vec3(10,0,-10);
    this.d = new vec3(10,0,10);
    
    this.at = new vec2(0.0,0.0);
    this.bt = new vec2(1.0,1.0);
    this.q1 = new Quad(this.a,this.b,this.c,this.d,
		      this.at, this.bt, this.at, this.bt);
};

Floor.prototype.initBuffers = function(gl_) {
    this.q1.initBuffers(gl_);
}

Floor.prototype.draw = function(gl_, shaders_) {
    var uUseTextureLocation = 
	gl.getUniformLocation(shaders_,"uUseTexture");
    gl_.uniform1f(uUseTextureLocation, 1);

    gl_.bindTexture(gl_.TEXTURE_2D, tileTexture);
    gl_.uniform1i(shaders_.samplerUniform, 0);

    this.q1.draw(gl_, shaders_);
};
