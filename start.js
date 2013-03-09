/**
 * Most variables used here are
 *  defined in 'functions.js'
 */

var models;
/**
 * Object holding modelview and perspective matrices.
 */
var theMatrix;

function Models() {
    this.objects = [];
}

Models.prototype.add = function(objToDraw) {
    if(objToDraw == "cylinder") {
	this.objects.push(new Cylinder(1, 4, 5, 30, 30));
    } else if(objToDraw == "sphere") {
	this.objects.push(new Sphere(2));
    } else if(objToDraw == "stool") {
	this.objects.push(new Stool());
    } else if(objToDraw == "torus") {
	this.objects.push(new Torus(0.2, 2));
    }
}

Models.prototype.draw = function() {
    for(var i = 0, max = this.objects.length;
	i < max; ++i) {
	this.objects[i].draw(); } }

/**
 * Begins the canvas.
 */
function start(objToDraw) {

    theMatrix = new GLmatrix();

    canvas = document.getElementById("glcanvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    gl = null;
    initGL(canvas);
    if (gl == null) { return; }

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

    document.onkeydown = handleKeyDown;
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
}

/**
 *  Draw the scene.
 */
function drawScene() {

    // Clear the canvas before we start drawing on it.
    gl.viewport(0, 0, 800, 800);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theMatrix.perspective(zoom.val, 0.1, 100.0);
    theMatrix.modelview();
    theMatrix.calcViewer();

    // Draw all our objects
    theMatrix.push();
    models.draw();
    theMatrix.pop();
    // Update side display as well
    drawDashboard();
}

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");
    
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = 
	gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = 
	gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.vertexColorAttribute = 
	gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = 
	gl.getUniformLocation(shaderProgram, "uPmatrix");
    shaderProgram.mvMatrixUniform = 
	gl.getUniformLocation(shaderProgram, "uMVmatrix");
    shaderProgram.transMatrixUniform = 
	gl.getUniformLocation(shaderProgram, "uTransMatrix");
    shaderProgram.nMatrixUniform = 
	gl.getUniformLocation(shaderProgram, "uNmatrix");
    shaderProgram.lightPositionUniform = 
	gl.getUniformLocation(shaderProgram, "uLightPos");
    shaderProgram.viewPositionUniform = 
	gl.getUniformLocation(shaderProgram, "uViewPos");
}
