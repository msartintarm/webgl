/**
a  c

b  d
 */
function Floor() {     
    //floor
    this.a = new vec3(-10,0,-10);
    this.b = new vec3(-10,0,10);
    this.c = new vec3(10,0,-10);
    this.d = new vec3(10,0,10);
    
    this.at = new vec2(0.0,0.0);
    this.bt = new vec2(0.0,1.0);
    this.ct = new vec2(1.0,0.0);
    this.dt = new vec2(1.0,1.0);

    this.q1 = new Quad(this.a,this.b,this.c,this.d);
    this.q1.initTextures(this.at, this.bt, this.ct, this.dt);
};

Floor.prototype.initBuffers = function(gl_) {
    this.q1.initBuffers(gl_);
}

Floor.prototype.draw = function(gl_, shaders_) {

    gl_.uniform1f(shaders_.useTextureU, 1);
    gl_.bindTexture(gl_.TEXTURE_2D, tileTexture);
    gl_.uniform1i(shaders_.samplerUniform, 0);

    this.q1.draw(gl_, shaders_);

    gl_.bindTexture(gl_.TEXTURE_2D, null);
    gl_.uniform1f(shaders_.useTextureU, 0.0);

};
