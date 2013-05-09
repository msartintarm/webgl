
/**
 * Object holding modelview and perspective matrices.
 */
var theMatrix;
var canvas2, gl2;
var mazeMode;
var myMaze;
var myStadium;
var stadiumMode;

function GLcanvas() {
    this.objects = [];
    this.textures = [];
    this.textureNums = [];
    this.frames = [];
    this.canvas = document.getElementById("glcanvas");
    this.gl = null;
	
	// Create status bar
	var display = document.getElementById("display");
	display.innerHTML = "<p id=\"glcanvas_status\"></p>" + display.innerHTML;
	
    // if we have errors, don't keep trying to draw the scene
    this.has_errors = false;
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

    this.resizeCounter = 0;

    return this;
}

GLcanvas.prototype.createScene = function(objToDraw) {

    mazeMode = 0;
    stadiumMode = 0;

    if(objToDraw == "cylinder") {
	this.objects.push(new Cylinder(1, 4, 5, 150, 150));
    } else if(objToDraw == "sphere") {
	this.objects.push(new Sphere(2));
    } else if(objToDraw == "skybox") {
	this.objects.push(new Skybox());
    } else if(objToDraw == "stool") {
	this.objects.push(new Stool());
    } else if(objToDraw == "jumbotron") {
	this.objects.push(new Jumbotron());
    } else if(objToDraw == "shadow") {
	this.objects.push(new MazePiece(5, NO_LEFT, TILE_TEXTURE));
	this.objects.push(new Stool());
    } else if(objToDraw == "maze") {
	myMaze = new Maze();
	this.objects.push(myMaze);
	this.objects.push(new StoolPyramid());
	this.objects.push(new Cagebox());
	mazeMode = 1;
	priveledgedMode.toggle();
	theMatrix.viewMaze();
    } 
    else if(objToDraw == "stadium") {
	myStadium = new Stadium();
	this.objects.push(myStadium);
	this.objects.push(new Skybox());
	theMatrix.viewStadium();
	stadiumMode = 1;
	//privledged toggled in glmatrix now(go thro start sequence first)
	//priveledgedMode.toggle();
    } else if(objToDraw == "framebuffer") {
	this.frames.push(new GLframe(FRAME_BUFF));
	this.objects.push(new Quad(
	    [-1, 1,-4],
	    [-1,-1,-4],
	    [ 1, 1,-4],
	    [ 1,-1,-4]).setTexture(FRAME_BUFF));

    } else if(objToDraw == "text") {
	this.string1 = new GLstring("testing 1.", TEXT_TEXTURE);
	this.string2 = new GLstring("testing 2.", TEXT_TEXTURE2);
	this.objects.push(this.string1);
	this.objects.push(this.string2);
	this.objects.push(new Quad(
	    [ 1.5, 0.8,-4.0],
	    [ 1.5,-0.8,-4.0],
	    [-1.5, 0.8,-4.0],
	    [-1.5,-0.8,-4.0]).setTexture(
		this.string1.num));
	this.objects.push(new Quad(
	    [ 1.5, 2.4,-4.0],
	    [ 1.5, 0.8,-4.0],
	    [-1.5, 2.4,-4.0],
	    [-1.5, 0.8,-4.0]).setTexture(
		this.string2.num));

    } else if(objToDraw == "torus") {
	this.objects.push(new Torus(0.2, 2));
    }
};

GLcanvas.prototype.bufferModels = function() {
    for(var i = 0, max = this.objects.length;
	i < max; ++i) {
	this.objects[i].initBuffers(this.gl); 
    }
};

GLcanvas.prototype.drawModels = function() {
    for(var i = 0, max = this.objects.length;
	i < max; ++i) {
	this.objects[i].draw(this.gl); 
    } 
};

/**
 * Begins the canvas.
 */
GLcanvas.prototype.start = function(theScene) {

    // Instantiate the Div this canvas element is within.
    expand("webgl_settings_button");

    if (this.gl === null) {
	// One-time display methods
	this.canvas.style.display = "inline-block";
	this.canvas.style.width = "100%";
	this.canvas.width = this.canvas.offsetWidth - 16;
	this.canvas.height = window.innerHeight - 150;

	if(this.initGL() !== 0) {
	    var theWindow = window.open(
		"GLerror.php", 
		"",
		"height=110,width=220,location=no,scrollbars=no");
	    theWindow.focus();
	    return;
	}

	this.shader_source = new GLshader;

	this.gl.shader = this.gl.createProgram();
	this.gl.shader_ball = this.gl.createProgram();
	this.gl.shader_frame = this.gl.createProgram();
	this.gl.shader_color = this.gl.createProgram();
	if(this.initShaders(this.gl.shader, 
			    "default", 
			    "default") !== 0 ||
	   this.initShaders(this.gl.shader_frame, 
			    "frame", 
			    "default") !== 0 ||
	   this.initShaders(this.gl.shader_ball, 
			    "ball", 
			    "default") !== 0 ||
	   this.initShaders(this.gl.shader_color, 
			    "color", 
			    "color") !== 0) {
	    var theWindow = window.open(
		"GLerror_shader.php", 
		"",
		"height=110,width=250,location=no,scrollbars=no");
	    theWindow.focus();
	    return;
	}
	this.gl.useProgram(this.gl.shader);

	// Get rid of unused JS  memory
	this.shader_source.cleanup();

	theMatrix.viewInit();
	this.objects = [];
	priveledgedMode.reset();
	mazeMode = 0;

	// Instantiate models
	this.createScene(theScene);

	// Instantiate any framebuffers created
	for(var i = 0; i < this.frames.length; ++i) {
	    this.frames[i].init(this.gl);
	}
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
	this.createScene(theScene);
	this.bufferModels();
    }
};

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
    catch(e) { console.log("%s",e); }
    // If we don't have a GL context, give up now
    if (!this.gl) { return 1; }

    this.gl.active = 0;	
    // sets textures we have already loaded.
    // some of them don't have sources
    this.gl.tex_enum = [];
    this.gl.tex_enum[FRAME_BUFF] = -1;
    this.gl.tex_enum[NO_TEXTURE] = -1;
    this.gl.tex_enum[TEXT_TEXTURE] = -1;
    this.gl.tex_enum[TEXT_TEXTURE2] = -1;
    this.gl.tex_enum[TEXT_TEXTURE3] = -1;
    this.gl.tex_enum[TEXT_TEXTURE4] = -1;

    window.onresize = function() {
	theCanvas.resizeCounter = 30;
    };
    return 0;
};

GLcanvas.prototype.resize = function() {
	this.canvas.width = this.canvas.offsetWidth - 16;
	this.canvas.height = window.innerHeight - 150;
	this.gl.viewportWidth = this.canvas.width;
	this.gl.viewportHeight = this.canvas.height;
};

/**
 *  Draw the scene.
 */
GLcanvas.prototype.drawScene = function() {
    
    // Clear the canvas before we start drawing on it.
    var error = this.gl.getError();
    if (error !== this.gl.NO_ERROR) {
	this.has_errors = true;
	while (error !== this.gl.NO_ERROR) {
	    alert("error: " + error);
	    error = this.gl.getError();
	}
    }

    if(envDEBUG === true && this.has_errors === true) { return; }

    for(var i = 0; i < this.frames.length; ++i) {
	this.frames[i].drawScene(this.gl);
    }

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | 
		  this.gl.DEPTH_BUFFER_BIT);

    theMatrix.perspective(zoom.val,
			  this.gl.viewportWidth / 
			  this.gl.viewportHeight,
			  0.1, 30000.0);

    // Draw all our objects
    theMatrix.push();
    this.drawModels();
    theMatrix.pop();
    // Update viewer's matrix
    theMatrix.update();
    // Update side display as well
    drawDashboard();

    if(this.resizeCounter > 0) {
	this.resizeCounter -= 1;
	if(this.resizeCounter === 0) {
	    this.resize();
	}
    }

//    this.gl.clear(this.gl.STENCIL_BUFFER_BIT);

};

GLcanvas.prototype.changeShader = function(new_shader) {

    var old_shader = this.gl.getParameter(this.gl.CURRENT_PROGRAM);
    if(old_shader === new_shader) return;

    this.disableAttribute(old_shader, "vPosA");
    this.disableAttribute(old_shader, "vNormA");
    this.disableAttribute(old_shader, "vColA");
    this.disableAttribute(old_shader, "textureA");

    this.gl.useProgram(new_shader);
};

GLcanvas.prototype.disableAttribute = function(gl_shader, name) {

    if(gl_shader.attribs[name] === -1) return;
    this.gl.disableVertexAttribArray(gl_shader.attribs[name]);
    gl_shader.attrib_enabled[name] = false;
}

GLcanvas.prototype.initShaders = function(gl_shader, frag, vert) {

    if(this.shader_source.init(this.gl, gl_shader, frag, vert) !== 0) return -1;

    gl_shader.sampler = 0;
    gl_shader.attribs = [];
    gl_shader.attrib_enabled = [];
    gl_shader.unis = [];


    this.initAttribute(gl_shader, "vPosA");

    this.initAttribute(gl_shader, "vNormA");
    this.initAttribute(gl_shader, "vColA");
    this.initAttribute(gl_shader, "textureA");

    this.initUniform(gl_shader, "ballHitu")
    this.initUniform(gl_shader, "u_kernel")
    this.initUniform(gl_shader, "u_textureSize")
    this.initUniform(gl_shader, "ambient_coeff_u");
    this.initUniform(gl_shader, "diffuse_coeff_u");
    this.initUniform(gl_shader, "specular_coeff_u");
    this.initUniform(gl_shader, "specular_color_u");
    this.initUniform(gl_shader, "pMatU"); // Perspecctive matrix
    this.initUniform(gl_shader, "mMatU"); // Model matrix
    this.initUniform(gl_shader, "vMatU"); // Viewing matrix
    this.initUniform(gl_shader, "nMatU"); // Model's normal matrix
    this.initUniform(gl_shader, "lMatU"); // Lighting matrix
    this.initUniform(gl_shader, "lightPosU"); // Initial light's position
    this.initUniform(gl_shader, "textureNumU");
    
    return 0;
};

/**
 * Some shaders won't have these attributes.
 *
 * If this is the case, they will not be added to the 
 * shaders' associative attributes list.
 */
GLcanvas.prototype.initAttribute = function(gl_shader, attr) {

    var theAttrib = this.gl.getAttribLocation(gl_shader, attr);
    gl_shader.attribs[attr] = theAttrib;
    gl_shader.attrib_enabled[attr] = false;
    if(theAttrib === -1) { return; }
    gl_shader.attrib_enabled[attr] = false;
};

GLcanvas.prototype.initUniform = function(gl_shader, uni) {
    gl_shader.unis[uni] = this.gl.getUniformLocation(gl_shader, uni);
};

var theCanvas;
