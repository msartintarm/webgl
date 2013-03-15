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
    if(objToDraw == "cylinder") {
	this.objects.push(new Cylinder(1, 4, 5, 150, 150));
	mazeMode = 0;
    } else if(objToDraw == "sphere") {
	this.objects.push(new Sphere(2));
	mazeMode = 0;
    } else if(objToDraw == "stool") {
	this.objects.push(new Stool());
	mazeMode = 0;
    } else if(objToDraw == "maze") {
	this.objects.push(new Maze());
	mazeMode = 1;
	priveledgedMode.toggle();
	theMatrix.vTranslate([20,2,9.0]);
	//theMatrix.viewMaze();
    } else if(objToDraw == "torus") {
	this.objects.push(new Torus(0.2, 2));
	mazeMode = 0;
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
    theMatrix.setConstUniforms(this.gl,this.shaders);
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
	this.canvas.style.display = "block";
	this.canvas.style.width = "100%";
	this.initGL();
	if (this.gl == null) { return; }
	this.initShaders("shader-fs", "shader-vs");
	this.initTextures();
	
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

/**
 * Begins the canvas.
 */
GLcanvas.prototype.start2 = function(objToDraw) {
    this.canvas = document.getElementById("glcanvas2");
    this.canvas.style.display = "block";
    this.canvas.style.width = "100%";
    this.initGL();
    if (this.gl == null) { return; }

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    this.initShaders();
    this.initTextures();
    
    // Instantiate models
    this.add(objToDraw);
    this.bufferModels();

    // Set background color, clear everything, and
    //  enable depth testing
    this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    
    // Set up to draw the scene periodically.
    tick2();  
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
    this.gl.viewport(0, 0, 800, 800);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | 
		  this.gl.DEPTH_BUFFER_BIT);

    theMatrix.perspective(zoom.val,
			  this.gl.viewportWidth / 
			  this.gl.viewportHeight,
			  0.1, 900.0);


    theMatrix.modelInit();

    // Draw all our objects
    theMatrix.push();
    this.drawModels();
    theMatrix.pop();
    // Update viewer's matrix
    theMatrix.update();
    // Update side display as well
    drawDashboard();
}

GLcanvas.prototype.initTextures = function() {
    woodTexture = this.gl.createTexture();
    woodImage = new Image();
    woodImage.onload = handleTextureLoaded.bind(
	undefined,
	this.gl,
	woodImage, 
	woodTexture);
    woodImage.src = "textures/wood.jpg";

    heavenTexture = this.gl.createTexture();
    heavenImage = new Image();
    heavenImage.onload = handleTextureLoaded.bind(
	undefined,
	this.gl,
	heavenImage, 
	heavenTexture);
    heavenImage.src = "textures/heaven.jpg";

    hellTexture = this.gl.createTexture();
    hellImage = new Image();
    hellImage.onload = handleTextureLoaded.bind(
	undefined,
	this.gl,
	hellImage, 
	hellTexture);
    hellImage.src = "textures/hell.png";

    floorTexture = this.gl.createTexture();
    floorImage = new Image();
    floorImage.onload = handleTextureLoaded.bind(
	undefined,
	this.gl,
	floorImage, 
	floorTexture);
    floorImage.src = "textures/floor.jpg";

    operaTexture = this.gl.createTexture();
    operaImage = new Image();
    operaImage.onload = handleTextureLoaded.bind(
	undefined,
	this.gl,
	operaImage, 
	operaTexture);
    operaImage.src = "textures/opera.png";
    
    brickTexture = this.gl.createTexture();
    brickImage = new Image();
    brickImage.onload = handleTextureLoaded.bind(
	this,
	this.gl,
	brickImage, 
	brickTexture);
    brickImage.src = "textures/brick.jpg";

    tileTexture = this.gl.createTexture();
    tileImage = new Image();
    tileImage.onload = handleTextureLoaded.bind(
	this,
	this.gl,
	tileImage, 
	tileTexture);
    tileImage.src = "textures/tiles.jpg";
}

GLcanvas.prototype.changeShaders = function(frag, vert) {
    this.initShaders(frag, vert);
    this.initTextures();
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

    //default to not use texture
    this.shaders.useTextureU = 
	this.gl.getUniformLocation(this.shaders,"uUseTexture");
    this.gl.uniform1f(this.shaders.useTextureU, 0.0);
    this.gl.activeTexture(this.gl.TEXTURE0);

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
}

var theCanvas;

