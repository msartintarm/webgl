/* 
this function stamps out the walls for one maze piece

the number of walls to build and texture for each wall is an input variable

each wall consists of 4 quads (right now at least)
probably can make this a variable parameter
*/
function MazePiece(f,b,r,l,ft,bt,rt,lt) { 
    //f,b,r,l boolean variables draw or not
    this.f = f;
    this.b = b;
    this.r = r;
    this.l = l;
    //specify textures for each wall (can have different textures)
    this.ft = ft;
    this.bt = bt;
    this.rt = rt;
    this.lt = lt;

    var a,b,c,d,at,bt,ct,dt;
    at = new vec2(0.0,0.0);
    bt = new vec2(1.0,0.0);
    ct = new vec2(0.0,1.0);
    dt = new vec2(1.0,1.0);

    //always draw the tiled floor
    a = new vec3(-10, 0, 10);
    b = new vec3(-10, 0,-10);
    c = new vec3( 10, 0, 10);
    d = new vec3( 10, 0,-10);
    this.qFloor = new Quad(a, b, c, d);
    this.qFloor.initTextures(at, bt, ct, dt);

    if(this.f){
	//front wall
	a = new vec3(-10,10,-10);
	b = new vec3(-10,0,-10);
	c = new vec3(10,10,-10);
	d = new vec3(10,0,-10);
	this.qFront = new Quad(a, b, c, d);
	this.qFront.initTextures(bt, dt, at, ct);
    }
    if(this.l){
	//left wall
	a = new vec3(-10,10,10);
	b = new vec3(-10,0,10);
	c = new vec3(-10,10,-10);
	d =  new vec3(-10,0,-10);
	this.qLeft = new Quad(a, b, c, d);
	this.qLeft.initTextures(bt, dt, at, ct);
    }
    if(this.r){
	//right wall
	a = new vec3(10,10,-10);
	b = new vec3(10,0,-10);
	c = new vec3(10,10,10);
	d = new vec3(10,0,10);	
	this.qRight = new Quad(a, b, c, d);
	this.qRight.initTextures(bt, dt, at, ct);
    }
    if(this.b){
	//behind wall
	a = new vec3(10,10,10);
	b = new vec3(10,0,10);
	c = new vec3(-10,10,10);
	d = new vec3(-10,0,10);	
	this.qBack = new Quad(a, b, c, d);
	this.qBack.initTextures(bt, dt, at, ct);
    }
};

MazePiece.prototype.initBuffers = function(gl_) {
    this.qFloor.initBuffers(gl_);
    if(this.f) this.qFront.initBuffers(gl_);
    if(this.b) this.qBack.initBuffers(gl_);
    if(this.r) this.qRight.initBuffers(gl_);
    if(this.l) this.qLeft.initBuffers(gl_);
}

MazePiece.prototype.draw = function(gl_, shaders_) {
    gl_.uniform1f(shaders_.useTextureU, 1);
    gl_.bindTexture(gl_.TEXTURE_2D, tileTexture);
    gl_.uniform1i(shaders_.samplerUniform, 0);
    this.qFloor.draw(gl_, shaders_);
    gl_.bindTexture(gl_.TEXTURE_2D, null);
    
    if(this.f==1){
	//draw front
	gl_.uniform1f(shaders_.useTextureU, 1);
	gl_.bindTexture(gl_.TEXTURE_2D, this.ft);
	gl_.uniform1i(shaders_.samplerUniform, 0);
	this.qFront.draw(gl_, shaders_);
	gl_.bindTexture(gl_.TEXTURE_2D, null);
    }
    if(this.b==1){
	//draw back
	gl_.uniform1f(shaders_.useTextureU, 1);
	gl_.bindTexture(gl_.TEXTURE_2D, this.bt);
	gl_.uniform1i(shaders_.samplerUniform, 0);
	this.qBack.draw(gl_, shaders_);
	gl_.bindTexture(gl_.TEXTURE_2D, null);
    }
    if(this.r==1){
	//draw right
	gl_.uniform1f(shaders_.useTextureU, 1);
	gl_.bindTexture(gl_.TEXTURE_2D, this.rt);
	gl_.uniform1i(shaders_.samplerUniform, 0);
	this.qRight.draw(gl_, shaders_);
	gl_.bindTexture(gl_.TEXTURE_2D, null);
    }
    if(this.l==1){
	//draw left
	gl_.uniform1f(shaders_.useTextureU, 1);
	gl_.bindTexture(gl_.TEXTURE_2D, this.lt);
	gl_.uniform1i(shaders_.samplerUniform, 0);
	this.qLeft.draw(gl_, shaders_);
	gl_.bindTexture(gl_.TEXTURE_2D, null);
    }
    gl_.uniform1f(shaders_.useTextureU, 0.0);

};
