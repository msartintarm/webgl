/**
 * Most variables used here are
 *  defined in 'functions.js'
 */

/**
 * Object holding modelview and perspective matrices.
 */
var theMatrix;
var canvas2, gl2;
var mazeMode;
var myMaze;

function GLcanvas() {
    this.objects = [];
    this.canvas = document.getElementById("glcanvas");
    this.gl = null;
    theMatrix = new GLmatrix();

    colorVec = vec3.fromValues(1,1,0);
    positionX = new MatrixData("positionXStats");
    positionY = new MatrixData("positionYStats");
    rotateY = new MatrixData("rotateStats");
    rotateCam = new MatrixData("rotateCamStats");
    zoom = new MatrixData("zoomPerspectiveStats");
    zoom.set(45);
    pause = new booleanData("pause");
    stoolHeight = new MatrixData("stoolHeight");
    priveledgedMode = new booleanData("priveledgedStats");
}

GLcanvas.prototype.add = function(objToDraw) {
    theMatrix.viewInit();
    this.objects = [];
    priveledgedMode.reset();
    mazeMode = 0;
    if(objToDraw == "cylinder") {
	this.objects.push(new Cylinder(1, 4, 5, 150, 150));
    } else if(objToDraw == "sphere") {
	this.objects.push(new Sphere(2));
    } else if(objToDraw == "skybox") {
	this.objects.push(new Skybox());
    } else if(objToDraw == "stool") {
	this.objects.push(new Stool());

    } else if(objToDraw == "maze") {
	myMaze = new Maze();
	this.objects.push(myMaze);
	this.objects.push(new StoolPyramid());
	this.objects.push(new Skybox());
	mazeMode = 1;
	priveledgedMode.toggle();
	theMatrix.viewMaze();
    } else if(objToDraw == "torus") {
	this.objects.push(new Torus(0.2, 2));
    }
    this.objects.push(new Light());
}

GLcanvas.prototype.bufferModels = function() {
    for(var i = 0, max = this.objects.length;
	i < max; ++i) {
	this.objects[i].initBuffers(this.gl); 
    }
}

GLcanvas.prototype.drawModels = function() {
    theMatrix.setViewUniforms(this.gl,this.shaders);
    for(var i = 0, max = this.objects.length;
	i < max; ++i) {
	this.objects[i].draw(this.gl, this.shaders); 
    } 
}

/**
 * Begins the canvas.
 */
GLcanvas.prototype.start = function(objToDraw) {
    if (this.gl == null) {
	// One-time display methods
	this.canvas.style.display = "inline-block";
	this.canvas.style.width = "100%";
	this.canvas.width = this.canvas.offsetWidth - 16;
	this.initGL();
	if (this.gl == null) { return; }
	this.initShaders("shader-fs", "shader-vs");
	this.initTextures();
	this.initSkybox();
	theMatrix.setConstUniforms(this.gl, this.shaders);
	
	// Instantiate models
	this.add(objToDraw);
	this.bufferModels();

	// Set background color, clear everything, and
	//  enable depth testing
	this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
	this.gl.clearDepth(1.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	
	// Set up to draw the scene periodically.
	document.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;
	document.onkeydown = handleKeyDown;
	tick();
    } else {
	// If we have started GL already, 
	//  just add the new model.
	this.add(objToDraw);
	this.bufferModels();
    }
}

/*
 * Initialize WebGL, returning the GL context or null if
 * WebGL isn't available or could not be initialized.
 */
GLcanvas.prototype.initGL = function() {
    try {
	this.gl = this.canvas.getContext("experimental-webgl");
	this.gl.viewportWidth = this.canvas.width;
	this.gl.viewportHeight = this.canvas.height;
    }
    catch(e) {}
    // If we don't have a GL context, give up now
    if (!this.gl) {
	alert("Unable to initialize WebGL. Your browser may not support it.");
    }
}

/**
 *  Draw the scene.
 */
GLcanvas.prototype.drawScene = function() {
    // Clear the canvas before we start drawing on it.
    var error = this.gl.getError();
    while (error != this.gl.NO_ERROR) {
	alert(error);
	error = this.gl.getError();

    }

    this.gl.viewport(0, 0, 800, 800);
    this.gl.viewport(0, 0, 800, 800);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | 
		  this.gl.DEPTH_BUFFER_BIT);

    theMatrix.perspective(zoom.val,
			  this.gl.viewportWidth / 
			  this.gl.viewportHeight,
			  0.1, 9000.0);


//    theMatrix.modelInit();
//    if(!mazeMode)
//	theMatrix.modelUpdate();

    // Draw all our objects
    theMatrix.push();
    this.drawModels();
    theMatrix.pop();
    // Update viewer's matrix
    theMatrix.update();
    // Update side display as well
    drawDashboard();}

var zz = 0;
const WOOD_TEXTURE = zz++;
const HEAVEN_TEXTURE = zz++;
const HELL_TEXTURE = zz++;
const FLOOR_TEXTURE = zz++;
const OPERA_TEXTURE = zz++;
const BRICK_TEXTURE = zz++;
const TILE_TEXTURE = zz++;
const NO_TEXTURE = zz++;
const SKYBOX_TEXTURE_1 = zz++;
const SKYBOX_TEXTURE_2 = zz++;
const SKYBOX_TEXTURE_3 = zz++;
const SKYBOX_TEXTURE_4 = zz++;
const SKYBOX_TEXTURE_5 = zz++;
const SKYBOX_TEXTURE_6 = zz++;
const RUG_TEXTURE = zz++;

GLcanvas.prototype.initSkybox = function() {
    var skyTextures = [];
    var skyImages = [];

    for(var i= 0; i < 6; ++i) {
	skyTextures[i] = this.gl.createTexture();
	skyImages[i] = new Image();
    skyImages[i].onload = this.loadTexture.bind(
	this,
	skyImages[i], 
	skyTextures[i],
	SKYBOX_TEXTURE_1 + i);
	skyImages[i].src = "skybox/cage" + i + ".jpg";
    }
}

GLcanvas.prototype.initTextures = function() {
    woodTexture = this.gl.createTexture();
    woodImage = new Image();
    woodImage.onload = this.loadTexture.bind(
	this,
	woodImage, 
	woodTexture,
	WOOD_TEXTURE);
    woodImage.src = "textures/wood.jpg";

    rugTexture = this.gl.createTexture();
    rugImage = new Image();
    rugImage.onload = this.loadTexture.bind(
	this,
	rugImage, 
	rugTexture,
	RUG_TEXTURE);
    rugImage.src = "textures/rug.jpg";


    heavenTexture = this.gl.createTexture();
    heavenImage = new Image();
    heavenImage.onload = this.loadTexture.bind(
	this,
	heavenImage, 
	heavenTexture,
	HEAVEN_TEXTURE);
    heavenImage.src = "textures/heaven.jpg";

    hellTexture = this.gl.createTexture();
    hellImage = new Image();
    hellImage.onload = this.loadTexture.bind(
	this,
	hellImage, 
	hellTexture,
	HELL_TEXTURE);
    hellImage.src = "textures/hell.png";

    floorTexture = this.gl.createTexture();
    floorImage = new Image();
    floorImage.onload = this.loadTexture.bind(
	this,
	floorImage, 
	floorTexture,
	FLOOR_TEXTURE);
    floorImage.src = "textures/floor.jpg";

    operaTexture = this.gl.createTexture();
    operaImage = new Image();
    operaImage.onload = this.loadTexture.bind(
	this,
	operaImage, 
	operaTexture,
	OPERA_TEXTURE);
    operaImage.src = "textures/opera.png";
    
    brickTexture = this.gl.createTexture();
    brickImage = new Image();
    brickImage.onload = this.loadTexture.bind(
	this,
	brickImage, 
	brickTexture,
	BRICK_TEXTURE);
    brickImage.src = "textures/brick.jpg";

    tileTexture = this.gl.createTexture();
    tileImage = new Image();
    tileImage.onload = this.loadTexture.bind(
	this,
	tileImage, 
	tileTexture,
	TILE_TEXTURE);
    tileImage.src = "textures/tiles.jpg";
}

GLcanvas.prototype.changeShaders = function(frag, vert) {
    this.initShaders(frag, vert);
    this.initTextures();
    this.initSkybox();
    this.bufferModels();
}

GLcanvas.prototype.initShaders = function(frag, vert) {
    var fragmentShader = getShader(this.gl, frag);
    var vertexShader = getShader(this.gl, vert);
    
    this.shaders = this.gl.createProgram();
    this.gl.attachShader(this.shaders, vertexShader);
    this.gl.attachShader(this.shaders, fragmentShader);
    this.gl.linkProgram(this.shaders);

    if (!this.gl.getProgramParameter(
	this.shaders, this.gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    this.gl.useProgram(this.shaders);

    this.shaders.vPosA = 
	this.gl.getAttribLocation(
	    this.shaders, "vPosA");
    this.gl.enableVertexAttribArray(
	this.shaders.vPosA);

    this.shaders.vNormA = 
	this.gl.getAttribLocation(
	    this.shaders, "vNormA");
    this.gl.enableVertexAttribArray(
	this.shaders.vNormA);

    this.shaders.vColA = 
	this.gl.getAttribLocation(this.shaders, "vColA");
    this.gl.enableVertexAttribArray(this.shaders.vColA);

    this.shaders.textureA = 
	this.gl.getAttribLocation(this.shaders, "textureA");
    this.gl.enableVertexAttribArray(this.shaders.textureA);

    this.shaders.textureNumA = 
	this.gl.getAttribLocation(this.shaders, "textureNumA");
    this.gl.enableVertexAttribArray(this.shaders.textureNumA);

    // Which texture to use
    this.shaders.woodU = 
	this.gl.getUniformLocation(this.shaders, "woodU");
    this.shaders.rugU = 
	this.gl.getUniformLocation(this.shaders, "rugU");
    this.shaders.heavenU = 
	this.gl.getUniformLocation(this.shaders, "heavenU");
    this.shaders.hellU = 
	this.gl.getUniformLocation(this.shaders, "hellU");
    this.shaders.floorU = 
	this.gl.getUniformLocation(this.shaders, "floorU");
    this.shaders.operaU = 
	this.gl.getUniformLocation(this.shaders, "operaU");
    this.shaders.brickU = 
	this.gl.getUniformLocation(this.shaders, "brickU");
    this.shaders.tileU = 
	this.gl.getUniformLocation(this.shaders, "tileU");
    this.shaders.noU = 
	this.gl.getUniformLocation(this.shaders, "noU");
    this.shaders.sky1U = 
	this.gl.getUniformLocation(this.shaders, "sky1U");
    this.shaders.sky2U = 
	this.gl.getUniformLocation(this.shaders, "sky2U");
    this.shaders.sky3U = 
	this.gl.getUniformLocation(this.shaders, "sky3U");
    this.shaders.sky4U = 
	this.gl.getUniformLocation(this.shaders, "sky4U");
    this.shaders.sky5U = 
	this.gl.getUniformLocation(this.shaders, "sky5U");
    this.shaders.sky6U = 
	this.gl.getUniformLocation(this.shaders, "sky6U");
    // Perspecctive matrix
    this.shaders.pMatU = 
	this.gl.getUniformLocation(this.shaders, "pMatU");
    // Model matrix
    this.shaders.mMatU = 
	this.gl.getUniformLocation(this.shaders, "mMatU");
    // Viewing matrix
    this.shaders.vMatU = 
	this.gl.getUniformLocation(this.shaders, "vMatU");
    // Model's normal matrix
    this.shaders.nMatU = 
	this.gl.getUniformLocation(this.shaders, "nMatU");
    // Lighting matrix
    this.shaders.lMatU = 
	this.gl.getUniformLocation(this.shaders, "lMatU");
    // Initial light's position
    this.shaders.lightPosU = 
	this.gl.getUniformLocation(this.shaders, "lightPosU");

    theMatrix.setConstUniforms(this.gl, this.shaders);
}

GLcanvas.prototype.loadTexture = function(image, texture, textureNum) {
    this.gl.activeTexture(this.gl.TEXTURE0 + textureNum);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, 
		   this.gl.RGBA, this.gl.RGBA, 
		   this.gl.UNSIGNED_BYTE, image);
    this.gl.texParameteri(this.gl.TEXTURE_2D, 
		      this.gl.TEXTURE_MAG_FILTER, 
		      this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, 
		      this.gl.TEXTURE_MIN_FILTER, 
		      this.gl.LINEAR_MIPMAP_NEAREST);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
}

var theCanvas;
