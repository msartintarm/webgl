// Locations of Wall

const FRONT = 0x1; // 0001
const BACK = 0x2; // 0010
const RIGHT = 0x4; // 0100
const LEFT = 0x8; // 1000

const NO_FRONT = BACK | RIGHT | LEFT;
const NO_LEFT = BACK | RIGHT | FRONT;
const BACK_LEFT = BACK | LEFT;
const NO_WALLS = 0x0;
const FRONT_BACK = FRONT | BACK;
const FRONT_RIGHT = RIGHT | FRONT;
const BACK_RIGHT = RIGHT | BACK;
const LEFT_RIGHT = RIGHT | LEFT;
const FRONT_LEFT = FRONT | LEFT;



/* 
this function stamps out the walls for one maze piece

the number of walls to build and texture for each wall is an input variable

each wall consists of 4 quads (right now at least)
probably can make this a variable parameter
*/
//function MazePiece(walls, ft, bt, rt, lt) { 
function MazePiece(walls, textures) { 
    //f,b,r,l boolean variables draw or not
    this.f = walls & FRONT;
    this.b = walls & BACK;
    this.r = walls & RIGHT;
    this.l = walls & LEFT;

    // Array with textures for each wall (can have up to 4 textures)
    // If instead a texture object is passed, uses it for  all walls
    if(!isNaN(textures)) {
	    this.ft = textures;
	    this.bt = textures;
	    this.rt = textures;
	    this.lt = textures;
    } else {
	var texNum = 0;
	if(this.f) { this.ft = textures[texNum++] };
	if(this.b) { this.bt = textures[texNum++] };
	if(this.r) { this.rt = textures[texNum++] };
	if(this.l) { this.lt = textures[texNum] };
    }

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
    this.qFloor = this.Quad(a, b, c, d)
    .invertNorms()
    .setTexture(TILE_TEXTURE);

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
	this.qFront = this.Prism(a,b,c,d,e,f,g,h).setTexture(this.ft);
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
	this.qLeft = this.Prism(a,b,c,d,e,f,g,h).setTexture(this.lt);
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
	this.qRight = this.Prism(a,b,c,d,e,f,g,h).setTexture(this.rt);
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
	this.qBack = this.Prism(a,b,c,d,e,f,g,h).setTexture(this.bt);
    }
};

MazePiece.prototype.initBuffers = _objsInitBuffers;
MazePiece.prototype.translate = _objsTranslate;
MazePiece.prototype.Quad = _Quad;
MazePiece.prototype.Prism = _Prism;

MazePiece.prototype.draw = function(gl_, shaders_) {

    gl_.uniform1f(shaders_.useTextureU, 1);
    gl_.uniform1i(shaders_.samplerU, TILE_TEXTURE);
    this.qFloor.draw(gl_, shaders_);
    
    if(this.f){ //draw front
	gl_.uniform1i(shaders_.samplerU, this.ft);
	this.qFront.draw(gl_, shaders_);
    }
    if(this.b){ //draw back
	gl_.uniform1i(shaders_.samplerU, this.bt);
	this.qBack.draw(gl_, shaders_);
    }
    if(this.r){ //draw right
	gl_.uniform1i(shaders_.samplerU, this.rt);
	this.qRight.draw(gl_, shaders_);
    }
    if(this.l){ //draw left
	gl_.uniform1i(shaders_.samplerU, this.lt);
	this.qLeft.draw(gl_, shaders_);
    }
    gl_.uniform1f(shaders_.useTextureU, 0.0);

};
