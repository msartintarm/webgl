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

    var position = theMatrix.getPosition();
    
 /*
   It gets a little confusing in here.  We never share walls, so to preserve
   the coordinate space the walls go from 8.5 to 11.5 (length of 3) expanding
   off of its coordinate space to another.  Since two quads are never stamped
   out on top of each other this gives the apperance of sharing walls.  When
   you see lengths of 11.4 that is to give the long wall texture preference
   over the short edge(looks crappy) when those conflicts do occur.
*/
    if(this.f){ this.qFront = this.FrontWall(this.ft); }
    if(this.l){ this.qLeft = this.LeftWall(this.lt); }
    if(this.r){ this.qRight = this.RightWall(this.rt); }
    if(this.b){ this.qBack = this.BackWall(this.bt); }
};

var bX_ = 11.4; // back X coordinates
var h_ = 10;    // height of wall
var bZ_ = 8.5;  // back Z coordinate
var bW_ = 3.0;  // width of back wall 

MazePiece.prototype.FrontWall = function(texture) {
    var front = new SixSidedPrism(
	[-bX_, h_, -(bZ_ + bW_)],
	[-bX_,  0, -(bZ_ + bW_)],
	[-bX_,  0, -(bZ_      )],
	[-bX_, h_, -(bZ_      )],
	[ bX_, h_, -(bZ_ + bW_)],
	[ bX_,  0, -(bZ_ + bW_)],
	[ bX_,  0, -(bZ_      )],
	[ bX_, h_, -(bZ_      )]).setTexture(texture);
    this.objs.push(front);
    return front;
}

MazePiece.prototype.LeftWall = function(texture) {
    var left = new SixSidedPrism(
	[-(bZ_ + bW_), h_, bX_],
	[-(bZ_ + bW_),  0, bX_],
	[-(bZ_      ),  0, bX_],
	[-(bZ_      ), h_, bX_],
	[-(bZ_ + bW_), h_,-bX_],
	[-(bZ_ + bW_),  0,-bX_],
	[-(bZ_      ),  0,-bX_],
	[-(bZ_      ), h_,-bX_]).setTexture(texture);
    this.objs.push(left);
    return left;
}

MazePiece.prototype.RightWall = function(texture) {
    var right = new SixSidedPrism(
	[bZ_ + bW_, h_, -bX_],
	[bZ_ + bW_,  0, -bX_],
	[bZ_      ,  0, -bX_],
	[bZ_      , h_, -bX_],
	[bZ_ + bW_, h_,  bX_],
	[bZ_ + bW_,  0,  bX_],
	[bZ_      ,  0,  bX_],
	[bZ_      , h_,  bX_]).setTexture(texture);
    this.objs.push(right);
    return right;
}

MazePiece.prototype.BackWall = function(texture) {
    var back = new SixSidedPrism(
	[ bX_, h_, bZ_ + bW_],
	[ bX_,  0, bZ_ + bW_],
	[ bX_,  0, bZ_      ],
	[ bX_, h_, bZ_      ],
	[-bX_, h_, bZ_ + bW_],
	[-bX_,  0, bZ_ + bW_],
	[-bX_,  0, bZ_      ],
	[-bX_, h_, bZ_      ]).setTexture(texture);
    this.objs.push(back);
    return back;
}

MazePiece.prototype.initBuffers = _objsInitBuffers;
MazePiece.prototype.translate = _objsTranslate;
MazePiece.prototype.Quad = _Quad;
MazePiece.prototype.Prism = _Prism;

/**
 *  The intention is that the Maze object will only call the
 *  check upon a maze piece if we are in its jurisdiction.
 *  This is the area it encompasses, plus a buffer zone.
 * 
 */
MazePiece.prototype.positionLegal = function(position, transMat) {

    if(this.f && position[0] - 1 < -bZ_) { return false; }
    if(this.b && position[0] + 1 >  bZ_) { return false; }
    if(this.r && position[2] + 1 >  bZ_) { return false; }
    if(this.l && position[2] - 1 < -bZ_) { return false; }

    return true;
}

MazePiece.prototype.draw = function(gl_, shaders_) {

    this.qFloor.draw(gl_, shaders_);
    
    if(this.f){ //draw front
	this.qFront.draw(gl_, shaders_);
    }
    if(this.b){ //draw back
	this.qBack.draw(gl_, shaders_);
    }
    if(this.r){ //draw right
	this.qRight.draw(gl_, shaders_);
    }
    if(this.l){ //draw left
	this.qLeft.draw(gl_, shaders_);
    }
};
