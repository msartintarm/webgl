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
//function StadiumPiece(walls, ft, bt, rt, lt) { 
function StadiumPiece(room_size, walls, textures) { 
    console.log("walls: %d room_size: %d textures: %d", walls, room_size, textures);

    //f,b,r,l boolean variables draw or not
    this.f = walls & FRONT;
    this.b = walls & BACK;
    this.r = walls & RIGHT;
    this.l = walls & LEFT;

    // only affects translate at the moment: TODO (mst)
    this.size = room_size;

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

    //always draw the tiled floor
    a = vec3.fromValues(-this.size, 0, this.size);
    b = vec3.fromValues(-this.size, 0,-this.size);
    c = vec3.fromValues( this.size, 0, this.size);
    d = vec3.fromValues( this.size, 0,-this.size);
    this.qFloor = this.Quad(a, b, c, d);

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
    // Bounds - N, S, W, and E - are created within as well.
};

var bX_ = this.size + 1.4; // back X coordinates
var h_ = this.size;    // height of wall
var bZ_ = this.size -1.5;  // back Z coordinate
var bW_ = 3.0;  // width of back wall 

StadiumPiece.prototype.FrontWall = function(texture) {
    var front = new SixSidedPrism(
	[ bX_, h_, -(bZ_ + bW_)],
	[ bX_,  0, -(bZ_ + bW_)],
	[ bX_,  0, -(bZ_      )],
	[ bX_, h_, -(bZ_      )],
	[-bX_, h_, -(bZ_ + bW_)],
	[-bX_,  0, -(bZ_ + bW_)],
	[-bX_,  0, -(bZ_      )],
	[-bX_, h_, -(bZ_      )]);
    this.objs.push(front);
    this.north = -(bZ_ - 1);
    return front;
}

StadiumPiece.prototype.LeftWall = function(texture) {
    var left = new SixSidedPrism(
	[-(bZ_ + bW_), h_,-bX_],
	[-(bZ_ + bW_),  0,-bX_],
	[-(bZ_      ),  0,-bX_],
	[-(bZ_      ), h_,-bX_],
	[-(bZ_ + bW_), h_, bX_],
	[-(bZ_ + bW_),  0, bX_],
	[-(bZ_      ),  0, bX_],
	[-(bZ_      ), h_, bX_]);
    this.objs.push(left);
    this.west = -(bZ_ - 1);
    return left;
}

StadiumPiece.prototype.RightWall = function(texture) {
    var right = new SixSidedPrism(
	[bZ_ + bW_, h_, -bX_],
	[bZ_ + bW_,  0, -bX_],
	[bZ_ + bW_,  0,  bX_],
	[bZ_ + bW_, h_,  bX_],
	[bZ_      , h_, -bX_],
	[bZ_      ,  0, -bX_],
	[bZ_      ,  0,  bX_],
	[bZ_      , h_,  bX_]);
    this.objs.push(right);
    this.east = bZ_ - 1;
    return right;
}

StadiumPiece.prototype.BackWall = function(texture) {
    var back = new SixSidedPrism(
	[ bX_, h_, bZ_      ],
	[ bX_,  0, bZ_      ],
	[ bX_,  0, bZ_ + bW_],
	[ bX_, h_, bZ_ + bW_],
	[-bX_, h_, bZ_      ],
	[-bX_,  0, bZ_      ],
	[-bX_,  0, bZ_ + bW_],
	[-bX_, h_, bZ_ + bW_]);
    this.objs.push(back);
    this.south = bZ_ - 1;
    return back;
}

StadiumPiece.prototype.initBuffers = _objsInitBuffers;

/**
 *  Translation will be done right after the object
 *  is created - we need to update our bounds 
 *  accordingly.
 */
StadiumPiece.prototype.translate = function(vec_) {

    for(var i = 0; i < this.objs.length; ++i) {
	this.objs[i].translate(vec_);
    }
    if(this.f){ this.north += vec_[2]; }
    if(this.l){ this.west += vec_[0]; }
    if(this.r){ this.east += vec_[0]; }
    if(this.b){ this.south += vec_[2]; }
    return this;
}

// Based upon the piece number, translate it by its coords
StadiumPiece.prototype.atCoord = function(x, y) {
	this.translate([x * this.size, 0, -y * this.size]);
}

StadiumPiece.prototype.Quad = _Quad;
StadiumPiece.prototype.Prism = _Prism;

/**
 *  The intention is that the Stadium object will only call the
 *  check upon a maze piece if we are in its jurisdiction.
 *  This is the area it encompasses, plus a buffer zone.
 * 
 */
StadiumPiece.prototype.positionLegal = function(position) {

    if(this.f && position[2] < this.north) { return false; }
    if(this.b && position[2] > this.south) { return false; }
    if(this.l && position[0] < this.west) { return false; }
    if(this.r && position[0] > this.east) { return false; }

    return true;
}

StadiumPiece.prototype.draw = function(gl_, shaders_) {

    for(var i = 0; i < this.objs.length; ++i) {
	this.objs[i].draw(gl_, shaders_);
    }
};
