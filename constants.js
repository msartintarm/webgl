// -- Textures -- // 
var zz = 0;
const WOOD_TEXTURE = zz; zz++;
const HEAVEN_TEXTURE = zz; zz++;
const HELL_TEXTURE = zz; zz++;
const FLOOR_TEXTURE = zz; zz++;
const OPERA_TEXTURE = zz; zz++;
const BRICK_TEXTURE = zz; zz++;
const TILE_TEXTURE = zz; zz++;
const NO_TEXTURE = zz; zz++;
const SKYBOX_TEXTURE_0 = zz; zz++;
const SKYBOX_TEXTURE_1 = zz; zz++;
const SKYBOX_TEXTURE_2 = zz; zz++;
const SKYBOX_TEXTURE_3 = zz; zz++;
const SKYBOX_TEXTURE_4 = zz; zz++;
const SKYBOX_TEXTURE_5 = zz; zz++;
const RUG_TEXTURE = zz; zz++;
const SKYBOX_TEXTURE_REAL = zz; zz++;
// -- Framebuffer -- // 
const FRAME_BUFF = zz; zz++;
const TEXT_TEXTURE = zz; zz++;
const TEXT_TEXTURE2 = zz; zz++;
const TEXT_TEXTURE3 = zz; zz++;
const TEXT_TEXTURE4 = zz; zz++;

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


// -- Environment Variables -- //
const envDEBUG = true;
