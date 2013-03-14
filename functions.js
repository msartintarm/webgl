/**
 * A bunch of utility functions we created.
 */
var colorVec;

// Default lighting and viewer positions
var lightPos =  [0.57735, 0.57735, 0.57735];
var viewPos = [0, 0, 1];

function MatrixData(htmlID) { 
    this.val = 0; 
    this.inc_ = 0; 
    this.html = document.getElementById(htmlID); 
}

MatrixData.prototype.pause = function() { this.inc_ = 0; }
MatrixData.prototype.set = function(num) { this.val = num; }
MatrixData.prototype.setInc = function(num) {     
    this.inc_ = num; 
    this.inc();
    this.html.style.display = "inline-block"; 
}
MatrixData.prototype.inc = function() {
    this.val = (this.val + this.inc_) % 360; 
}

MatrixData.prototype.incBy = function(val) {
    this.val = (this.val + val) % 360; 
}

MatrixData.prototype.setIncZoom = function(num) { 
    this.val = this.val + num; 
    if(this.val > 180) this.val = 180;
    if(this.val < 0) this.val = 0;
 }

MatrixData.prototype.setStoolHeight = function(num) { 
    this.val = this.val + num; 
    if(this.val > 4.375) this.val = 4.375;
    if(this.val < 0) this.val = 0;
 }

MatrixData.prototype.dec = function() { 
    this.val = (this.val - this.inc_) % 360; }

MatrixData.prototype.reset = function() {
    this.val = 0;
    this.inc_ = 0; 
    this.html.style.display = "none"; }

MatrixData.prototype.isZero = function() {
    return(this.val == 0); }

function booleanData(htmlID){
    this.val = 0;
}

booleanData.prototype.reset = function(){
    this.val = 0;
    }

booleanData.prototype.toggle = function(){
    if(this.val == 0) this.val = 1;
    else this.val = 0;
}

var stoolHeight;
var rotateY;
var rotateCam;
var positionX;
var positionY;
var zoom;
var pause;

function resetModel() { 
    rotateY.reset(); 
    positionX.reset(); 
    positionY.reset(); 
    rotateCam.reset();
    zoom.set(45);
    pause.reset();
    stoolHeight.reset();
 }

function drawDashboard() {
    if(rotateCam.html.style.display == "inline-block") {
	rotateCam.html.innerHTML = "Rotation - Cam: " + rotateCam.val + "&deg;";
	rotateCam.inc();
    }
    if(rotateY.html.style.display == "inline-block") {
	rotateY.html.innerHTML = "Rotation - Y: " + rotateY.val + "&deg;";
	rotateY.inc();
    }
    if(!positionX.isZero()) {
	positionX.html.innerHTML = "Position - X: " + positionX.val;
    } else {
	positionX.html.innerHTML = "";
    }
    if(!positionY.isZero()) {
	positionY.html.innerHTML = "Position - Y: " + positionY.val;
    } else {
	positionY.html.innerHTML = "";
    }
    zoom.inc();
}

Array.prototype.push2 = function(a, b) {
    this.push(a);
    this.push(b);
}

Array.prototype.push3 = function(a, b, c) {
    this.push(a);
    this.push(b);
    this.push(c); 
}

Array.prototype.pushV = function(vector) {
    this.push(vector[0]);
    this.push(vector[1]);
    this.push(vector[2]); 
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl_, id) {
    var shaderScript = document.getElementById(id);
    
    // Didn't find an element with the specified ID; abort.
    
    if (!shaderScript) {
	return null;
    }
    
    // Walk through the source element's children, building the
    // shader source string.
    
    var theSource = "";
    var currentChild = shaderScript.firstChild;
    
    while(currentChild) {
	if (currentChild.nodeType == 3) {
	    theSource += currentChild.textContent;
	}
	
	currentChild = currentChild.nextSibling;
    }
    
    // Now figure out what type of shader script we have,
    // based on its MIME type.
    
    var shader;
    
    if (shaderScript.type == "x-shader/x-fragment") {
	shader = gl_.createShader(gl_.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
	shader = gl_.createShader(gl_.VERTEX_SHADER);
    } else {
	return null;  // Unknown shader type
    }
    
    // Send the source to the shader object
    gl_.shaderSource(shader, theSource);
    
    // Compile the shader program
    gl_.compileShader(shader);
    
    // See if it compiled successfully
    
    if (!gl_.getShaderParameter(shader, gl_.COMPILE_STATUS)) {
	alert("An error occurred compiling the shaders: " + 
	      gl_.getShaderInfoLog(shader));
	return null;
    }    
    return shader;
}

var mouseIsDown = false;
var lastMouseX = null;
var lastMouseY = null;

var lightMatrix = mat4.create();
mat4.identity(lightMatrix);

function handleMouseDown(event) {
    mouseIsDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function handleMouseUp(event) {
    mouseIsDown = false;
}

function handleMouseMove(event) {
    if (!mouseIsDown) { return; }

    var newX = event.clientX;
    var newY = event.clientY;

    if(lightWillRotate) {
	var transLightMatrix = mat4.create();
	mat4.identity(transLightMatrix);
	mat4.rotate(
	    transLightMatrix,
	    transLightMatrix,
	    Math.PI / 180 * 2 * (
		(newX - mouseX) / 10),
	    [0, 1, 0]);
	mat4.rotate(transLightMatrix,
		    transLightMatrix,
		    Math.PI / 180 * 2 * (
			(newY - mouseY) / 10),
		    [1, 0, 0]);
	mat4.multiply(lightMatrix, 
		      transLightMatrix,
		      lightMatrix);
    } else {
	mat4.translate(lightMatrix,
		       lightMatrix,
		       [(newX - mouseX) / 30, 0, 0]);
	mat4.translate(lightMatrix,
		       lightMatrix,
		       [0, (mouseY - newY) / 30, 0]);
    }
    mouseX = newX;
    mouseY = newY;
}

var wrongKey = false;
var lightWillRotate = false;

function handleKeyDown(theEvent) {

    if(wrongKey) {
	wrongKey = false;
	document.getElementById("keyboard").innerHTML = "";
    }

    switch(theEvent.keyCode) {
	
    case 16: // shift
	lightWillRotate = !lightWillRotate;
	if(lightWillRotate) {
	    document.getElementById("keyboard").innerHTML = 
		"Light movement: TRANSLATION --> ROTATION";
	} else {
	    document.getElementById("keyboard").innerHTML = 
		"Light movement: TRANSLATION <-- ROTATION";
	}
	break;
    case 32: // spacebar
	theMatrix.jump();
	document.getElementById("keyboard").innerHTML = 
	    "Key " + theEvent.keyCode + " is undefined.";
	break;
    case 39:
	theMatrix.moveLeft();
	break;
    case 37:
	theMatrix.moveRight();
	break;
    case 38:
	theMatrix.moveUp();
	break;
    case 40:
	theMatrix.moveDown();
	break;
    case 65: // a
	theMatrix.moveForward();
	break;
    case 90: // z
	theMatrix.moveBack();
	break;
    case 74: // j
	theMatrix.lookLeft();
	break;
    case 76: // l
	theMatrix.lookRight();
	break;
    case 73: // i
	theMatrix.lookUp();
	break;
    case 75: // k
	theMatrix.lookDown();
	break;
    default:
	wrongKey = true;
	document.getElementById("keyboard").innerHTML = 
	    "Key " + theEvent.keyCode + " is undefined.";
	break;
    }
}

function tick() {
	requestAnimFrame(tick2);
	theCanvas.drawScene();
}

function tick2() {
	requestAnimFrame(tick);
	theCanvas.drawScene();
}

function handleTextureLoaded(gl_, image, texture) {

    gl_.bindTexture(gl_.TEXTURE_2D, texture);
    gl_.texImage2D(gl_.TEXTURE_2D, 0, 
		       gl_.RGBA, gl_.RGBA, 
		       gl_.UNSIGNED_BYTE, image);
    gl_.texParameteri(gl_.TEXTURE_2D, 
			  gl_.TEXTURE_MAG_FILTER, 
			  gl_.LINEAR);
    gl_.texParameteri(gl_.TEXTURE_2D, 
			  gl_.TEXTURE_MIN_FILTER, 
			  gl_.LINEAR_MIPMAP_NEAREST);
    gl_.generateMipmap(gl_.TEXTURE_2D);
    gl_.bindTexture(gl_.TEXTURE_2D, null);
}

