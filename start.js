/**
 * Most variables used here are
 *  defined in 'functions.js'
 */

var models;
/**
 * Object holding modelview and perspective matrices.
 */
var theMatrix;

var canvas2, gl2;

function GLcanvas() {
    this.objects = [];
    this.canvas = null;
    theMatrix = new GLmatrix();
}

var theCanvas = new GLcanvas();

GLcanvas.prototype.add = function(objToDraw) {
    if(objToDraw == "cylinder") {
	this.objects.push(new Cylinder(1, 4, 5, 300, 300));
    } else if(objToDraw == "sphere") {
	this.objects.push(new Sphere(2));
    } else if(objToDraw == "stool") {
	this.objects.push(new Stool());
    } else if(objToDraw == "torus") {
	this.objects.push(new Torus(0.2, 2));
    }
	this.objects.push(new Light());
}

GLcanvas.prototype.bufferModels = function() {
    for(var i = 0, max = this.objects.length;
	i < max; ++i) {
	this.objects[i].initBuffers(this.gl); } }

GLcanvas.prototype.drawModels = function() {
    for(var i = 0, max = this.objects.length;
	i < max; ++i) {
	this.objects[i].draw(this.gl); } }

/**
 * Begins the canvas.
 */
GLcanvas.prototype.start = function(objToDraw) {

    theMatrix = new GLmatrix();

    this.canvas = document.getElementById("glcanvas");
    this.canvas.style.display = "block";
    this.canvas.style.width = "100%";
    this.initGL();
    if (this.gl == null) { return; }

    colorVec = new vec3(1,1,0);
    positionX = new MatrixData("positionXStats");
    positionY = new MatrixData("positionYStats");
    rotateY = new MatrixData("rotateStats");
    rotateCam = new MatrixData("rotateCamStats");
    zoom = new MatrixData("zoomPerspectiveStats");
    zoom.set(45);
    pause = new booleanData("pause");
    stoolHeight = new MatrixData("stoolHeight");

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    this.initShaders();
    
    // Instantiate models
    this.add(objToDraw);

    this.bufferModels();

    this.gl.clearColor(0.1, 0.1, 0.1, 1.0);  // Set background color
    this.gl.clearDepth(1.0);                 // Clear everything
    this.gl.enable(this.gl.DEPTH_TEST);      // Enable depth testing
    
    // Set up to draw the scene periodically.
    this.tick();    

    document.onkeydown = handleKeyDown;
}

/**
 * Begins the canvas.
 */
function start2() {

    canvas2 = document.getElementById("glcanvas2");
    canvas2.style.display = "block";
    canvas2.style.width = "100%";
    gl2 = initGL(canvas2);
    if (gl2 == null) { return; }

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    initShaders();
    
    // Instantiate models
    models = new Models();
    models.add(objToDraw);

    gl.clearColor(0.1, 0.1, 0.1, 1.0);  // Set background color
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    
    // Set up to draw the scene periodically.
    tick();    
}

function handleKeyDown(theEvent) {
    if(theEvent.keyCode == 39) {
	theMatrix.moveLeft(); }
    else if(theEvent.keyCode == 37) {
	theMatrix.moveRight(); }
    if(theEvent.keyCode == 38) {
	theMatrix.moveUp(); }
    if(theEvent.keyCode == 40) {
	theMatrix.moveDown(); }
    if(theEvent.keyCode == 74) { // j
	theMatrix.lookLeft(); }
    else if(theEvent.keyCode == 76) { // l
	theMatrix.lookRight(); }
    if(theEvent.keyCode == 73) { // i
	theMatrix.lookUp(); }
    if(theEvent.keyCode == 75) { // k
	theMatrix.lookDown(); }
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

GLcanvas.prototype.tick = function() {
    window.requestAnimFrame(this.tick);
    this.drawScene();
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
			  0.1, 100.0);
    theMatrix.modelview();
    theMatrix.calcViewer();

    // Draw all our objects
    theMatrix.push();
    this.drawModels();
    theMatrix.pop();
    // Update side display as well
    drawDashboard();
}

GLcanvas.prototype.initShaders = function() {
    var fragmentShader = getShader(this.gl, "shader-fs");
    var vertexShader = getShader(this.gl, "shader-vs");
    
    shaders = this.gl.createProgram();
    this.gl.attachShader(
	shaders, vertexShader);
    this.gl.attachShader(
	shaders, fragmentShader);
    this.gl.linkProgram(shaders);

    if (!this.gl.getProgramParameter(
	shaders, this.gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    this.gl.useProgram(shaders);

    shaders.vPosA = 
	this.gl.getAttribLocation(
	    shaders, "vPosA");
    this.gl.enableVertexAttribArray(
	shaders.vPosA);

    shaders.vNormA = 
	this.gl.getAttribLocation(
	    shaders, "vNormA");
    this.gl.enableVertexAttribArray(
	shaders.vNormA);

    shaders.vColA = 
	this.gl.getAttribLocation(shaders, "vColA");
    this.gl.enableVertexAttribArray(shaders.vColA);

    shaders.pMatU = 
	this.gl.getUniformLocation(shaders, "pMatU");
    shaders.mMatU = 
	this.gl.getUniformLocation(shaders, "mMatU");
    shaders.vMatU = 
	this.gl.getUniformLocation(shaders, "vMatU");
    shaders.nMatU = 
	this.gl.getUniformLocation(shaders, "nMatU");
    shaders.lightPosU = 
	this.gl.getUniformLocation(shaders, "lightPosU");
}
