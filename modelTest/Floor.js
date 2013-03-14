/**
a  c

b  d
 */
function Floor() {     
    //floor
    this.a = vec3.create(-10, 0, 10);
    this.b = vec3.create(-10, 0,-10);
    this.c = vec3.create( 10, 0, 10);
    this.d = vec3.create( 10, 0,-10);
    
    this.at = vec2.create(0.0, 0.0);
    this.bt = vec2.create(0.0, 1.0);
    this.ct = vec2.create(1.0, 0.0);
    this.dt = vec2.create(1.0, 1.0);

    this.o =new GLobject();
    this.o.Quad(this.a,
		this.b,
		this.c,
		this.d);
    this.o.initTextures(this.at, 
			this.bt, 
			this.ct, 
			this.dt);
};

Floor.prototype.initBuffers = function(gl_) {
    this.o.initBuffers(gl_);
}

Floor.prototype.draw = function(gl_, shaders_) {

    gl_.uniform1f(shaders_.useTextureU, 1);
    gl_.bindTexture(gl_.TEXTURE_2D, tileTexture);
    gl_.uniform1i(shaders_.samplerUniform, 0);

    this.o.drawBuffers(gl_, shaders_);

    gl_.uniform1f(shaders_.useTextureU, 0.0);
    gl_.bindTexture(gl_.TEXTURE_2D, null);

};
