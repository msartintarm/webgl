// -- Textures -- // 
var zz = 0;
const WOOD_TEXTURE = zz++;
const HEAVEN_TEXTURE = zz++;
const HELL_TEXTURE = zz++;
const FLOOR_TEXTURE = zz++;
const OPERA_TEXTURE = zz++;
const BRICK_TEXTURE = zz++;
const TILE_TEXTURE = zz++;
const NO_TEXTURE = zz++;
const SKYBOX_TEXTURE_0 = zz++;
const SKYBOX_TEXTURE_1 = zz++;
const SKYBOX_TEXTURE_2 = zz++;
const SKYBOX_TEXTURE_3 = zz++;
const SKYBOX_TEXTURE_4 = zz++;
const SKYBOX_TEXTURE_5 = zz++;
const RUG_TEXTURE = zz++;

// -- Framebuffer -- // 
const FRAME_BUFF = 16;

// -- Player movement -- //
const lookDist = 1 / 20;
const moveDist = 2.1;

// -- Maze Piece wall locations -- //
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


