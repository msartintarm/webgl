
function Wall() { 
    //back wall
    var a = vec3.fromValues(-10,10,-10);
    var b = vec3.fromValues(-10,0,-10);
    var c = vec3.fromValues(10,10,-10);
    var d = vec3.fromValues(10,0,-10);
    
    var at = vec2.fromValues(0.0,0.0);
    var bt = vec2.fromValues(0.0,1.0);
    var ct = vec2.fromValues(1.0,0.0);
    var dt = vec2.fromValues(1.0,1.0);

    this.o = new GLobject();
    this.o.Quad(a, b, c, d);
    this.o.initTextures(dt, at, ct, bt);

    //left wall
    vec3.set(a,-10,10, 10);
    vec3.set(b,-10, 0, 10);
    vec3.set(c,-10,10,-10);
    vec3.set(d,-10, 0,-10);
    
    this.o.Quad(a, b, c, d);
    this.o.initTextures(dt, at, dt, at);

    //right wall
    vec3.set(a, 10,10,-10);
    vec3.set(b, 10,0,-10);
    vec3.set(c, 10,10,10);
    vec3.set(d, 10,0,10);
     
    this.o.Quad(a, b, c, d);
    this.o.initTextures(ct, bt, dt, at);
};

Wall.prototype.initBuffers = function(gl_) {
    this.o.initBuffers(gl_);
}

Wall.prototype.draw = function(gl_, shaders_) {

    gl_.uniform1f(shaders_.useTextureU, 1.0);
    gl_.bindTexture(gl_.TEXTURE_2D, woodTexture);
    gl_.uniform1i(shaders_.samplerUniform, 0);

    this.o.drawBuffers(gl_, shaders_);

    gl_.uniform1f(shaders_.useTextureU, 0.0);
    gl_.bindTexture(gl_.TEXTURE_2D, null);
};
