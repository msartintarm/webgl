
function Wall() { 
    //back wall
    this.a = new vec3(-10,10,-10);
    this.b = new vec3(-10,0,-10);
    this.c = new vec3(10,10,-10);
    this.d = new vec3(10,0,-10);
    
    this.at = new vec2(0.0,0.0);
    this.bt = new vec2(0.0,1.0);
    this.ct = new vec2(1.0,0.0);
    this.dt = new vec2(1.0,1.0);
    this.q1 = new Quad(this.a,this.b,this.c,this.d,
		      this.dt, this.at, this.ct, this.bt);

    //left wall
    this.a = new vec3(-10,10,10);
    this.b = new vec3(-10,0,10);
    this.c = new vec3(-10,10,-10);
    this.d =  new vec3(-10,0,-10);
    
    this.q2 = new Quad(this.a,this.b,this.c,this.d,
		      this.dt, this.at, this.dt, this.at);

    //right wall
    this.a = new vec3(10,10,-10);
    this.b = new vec3(10,0,-10);
    this.c = new vec3(10,10,10);
    this.d = new vec3(10,0,10);
    
    this.q3 = new Quad(this.a,this.b,this.c,this.d,
		      this.ct, this.bt, this.dt, this.at);   
};

Wall.prototype.draw = function() {
    var uUseTextureLocation = gl.getUniformLocation(shaderProgram,"uUseTexture");
    gl.uniform1f(uUseTextureLocation, 1.0);

    gl.bindTexture(gl.TEXTURE_2D, woodTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    this.q1.draw();
    this.q2.draw();
    this.q3.draw();
};