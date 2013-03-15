// Locations of Wall

const FRONT = 0x1; // 0001
const BACK = 0x2; // 0010
const RIGHT = 0x4; // 0100
const LEFT = 0x8; // 1000

const NO_FRONT = BACK | RIGHT | LEFT;
const BACK_LEFT = BACK | LEFT;
const NONE = 0x0;
const NONE = 0x0;
const FRONT_BACK = FRONT | BACK;
const BACK_RIGHT = RIGHT | BACK;
const LEFT_RIGHT = RIGHT | LEFT;
const FRONT_LEFT = FRONT | LEFT;



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

    this.objs = [];

    var a,b,c,d,at,bt,ct,dt;
    at = vec2.fromValues(0.0,0.0);
    bt = vec2.fromValues(1.0,0.0);
    ct = vec2.fromValues(0.0,1.0);
    dt = vec2.fromValues(1.0,1.0);

    //always draw the tiled floor
    a = vec3.fromValues(-10, 0, 10);
    b = vec3.fromValues(-10, 0,-10);
    c = vec3.fromValues( 10, 0, 10);
    d = vec3.fromValues( 10, 0,-10);
    this.qFloor = this.Quad(a, b, c, d).initTextures(at, bt, ct, dt);

    //define the bounds for walls
    //A VALUE OF -100 MEANS NO BOUNDS
    //can't use -1 b/c that is in our area
    this.pX_bound = -100;
    this.nX_bound = -100;
    this.pZ_bound = -100;
    this.nZ_bound = -100;

    var position = theMatrix.getMvPos();
    
 /*
   It gets a little confusing in here.  We never share walls, so to preserve
   the coordinate space the walls go from 8.5 to 11.5 (length of 3) expanding
   off of its coordinate space to another.  Since two quads are never stamped
   out on top of each other this gives the apperance of sharing walls.  When
   you see lengths of 11.4 that is to give the long wall texture preference
   over the short edge(looks crappy) when those conflicts do occur.
*/
    if(this.f){
	//front wall
	a = vec3.fromValues(-11.4,10,-11.5);
	b = vec3.fromValues(-11.4,0,-11.5);
	c = vec3.fromValues(-11.4,0,-8.5);
	d = vec3.fromValues(-11.4,10,-8.5);
	e = vec3.fromValues(11.4,10,-11.5);
	f = vec3.fromValues(11.4,0,-11.5);
	g = vec3.fromValues(11.4,0,-8.5);
	h = vec3.fromValues(11.4,10,-8.5);

	this.nZ_bound = position[2] - 8;
	this.qFront = this.Prism(a,b,c,d,e,f,g,h);
    }
    if(this.l){
	//left wall
	a = vec3.fromValues(-11.5,10,11.4);
	b = vec3.fromValues(-11.5,0,11.4);
	c = vec3.fromValues(-8.5,0,11.4);
	d = vec3.fromValues(-8.5,10,11.4);
	e = vec3.fromValues(-11.5,10,-11.4);
	f =  vec3.fromValues(-11.5,-11.4);
	g = vec3.fromValues(-8.5,0,-11.4);
	h =  vec3.fromValues(-8.5,10,-11.4);

	this.nX_bound = position[0] - 8;
	this.qLeft = this.Prism(a, b, c, d, e, f, g, h);
    }
    if(this.r){
	//right wall
	a = vec3.fromValues(11.5,10,-11.4);
	b = vec3.fromValues(11.5,0,-11.4);
	c = vec3.fromValues(8.5,0,-11.4);
	d = vec3.fromValues(8.5,10,-11.4);
	e = vec3.fromValues(11.5,10,11.4);
	f = vec3.fromValues(11.5,0,11.4);   
        g = vec3.fromValues(8.5,0,11.4);
	h = vec3.fromValues(8.5,10,11.4);

	this.pX_bound = 8 + position[0];
	this.qRight = this.Prism(a, b, c, d, e, f, g, h);
    }
    if(this.b){
	//behind wall
	a = vec3.fromValues(11.4,10,11.5);
	b = vec3.fromValues(11.4,0,11.5);
	c = vec3.fromValues(11.4,0,8.5);
	d = vec3.fromValues(11.4,10,8.5);
	e = vec3.fromValues(-11.4,10,11.5);
	f = vec3.fromValues(-11.4,0,11.5);
	g = vec3.fromValues(-11.4,0,8.5);
	h = vec3.fromValues(-11.4,10,8.5);

	this.pZ_bound = position[2] + 8;
	this.qBack = this.Prism(a, b, c, d, e, f, g, h);
    }
};

MazePiece.prototype.initBuffers = _objsInitBuffers;
MazePiece.prototype.translate = _objsTranslate;
MazePiece.prototype.Quad = _Quad;
MazePiece.prototype.Prism = _Prism;

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
	gl_.uniform1i(shaders_.samplerUniform, 1);
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
