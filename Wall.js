
function Wall() { 
    //back wall
    var a = new vec3(-10,10,-10);
    var b = new vec3(-10,0,-10);
    var c = new vec3(10,10,-10);
    var d = new vec3(10,0,-10);
    
    var at = new vec2(0.0,0.0);
    var bt = new vec2(0.0,1.0);
    var ct = new vec2(1.0,0.0);
    var dt = new vec2(1.0,1.0);
    this.q1 = new Quad(a, b, c, d);
    this.q1.initTextures(dt, at, ct, bt);

    //left wall
    a = new vec3(-10,10,10);
    b = new vec3(-10,0,10);
    c = new vec3(-10,10,-10);
    d =  new vec3(-10,0,-10);
    
    this.q2 = new Quad(a, b, c, d);
    this.q2.initTextures(dt, at, dt, at);

    //right wall
    a = new vec3(10,10,-10);
    b = new vec3(10,0,-10);
    c = new vec3(10,10,10);
    d = new vec3(10,0,10);
     
    this.q3 = new Quad(a, b, c, d);
    this.q3.initTextures(ct, bt, dt, at);
};

Wall.prototype.initBuffers = function(gl_) {
    this.q1.initBuffers(gl_);
    this.q2.initBuffers(gl_);
    this.q3.initBuffers(gl_);
}

Wall.prototype.draw = function(gl_, shaders_) {

    gl_.uniform1f(shaders_.useTextureU, 1);
    gl_.bindTexture(gl_.TEXTURE_2D, woodTexture);
    gl_.uniform1i(shaders_.samplerUniform, 0);

    this.q1.draw(gl_, shaders_);
    this.q2.draw(gl_, shaders_);
    this.q3.draw(gl_, shaders_);

    gl_.bindTexture(gl_.TEXTURE_2D, null);
    gl_.uniform1f(shaders_.useTextureU, 0.0);
};
