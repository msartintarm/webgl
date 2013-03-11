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

Floor.prototype.draw = function() {
    var uUseTextureLocation = gl.getUniformLocation(shaderProgram,"uUseTexture");
    gl.uniform1f(uUseTextureLocation, 1);

    gl.bindTexture(gl.TEXTURE_2D, tileTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    this.q1.draw();
};


