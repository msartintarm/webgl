/**
 * A bunch of utility functions we created.
 */
var colorVec;

// Default lighting and viewer positions
var lightPos =  [0.5, 0.4, -2];
var viewPos = [0, 0, 1];

function MatrixData(htmlID) { 
    this.val = 0; 
    this.inc_ = 0; 
    this.html = document.getElementById(htmlID); 
}

// Quad constructor that pushes
// it to an internal 'objs' array,
// making it easier to draw
function _Quad(a,b,c,d) {
    var newQuad = new Quad(a,b,c,d);
    this.objs.push(newQuad);
    return newQuad;
}

function _Prism(a,b,c,d,e,f,g,h) {
    var newPrism = new SixSidedPrism(a,b,c,d,e,f,g,h);
    this.objs.push(newPrism);
    return newPrism;
}

function _Disk(a,b,c,d) {
    var newDisk = new Disk(a,b,c,d);
    this.objs.push(newDisk);
    return newDisk;
}

function _Cyl(a,b,c,d,e) {
    var newCyl = new Cylinder(a,b,c,d,e);
    this.objs.push(newCyl);
    return newCyl;
}

//Maze.prototype.function Piece(a,b,c,d,e,f,g,h) {
//    var newPiece = new MazePiece(a,b,c,d,e,f,g,h);
//    this.pieces.push(newPiece);
//    return newCyl;
//}

function _Torus(a,b) {
    var newTorus = new Torus(a,b);
    this.objs.push(newTorus);
    return newTorus;
}

/**
 *  Functions for high-level objects
 *  that contain arrays of shapes
 */
function _objsInitBuffers(gl_) {
    for(var i = 0; i < this.objs.length; ++i) {
	this.objs[i].initBuffers(gl_);
    }
    return this;
}

function _objsTranslate(vec_) {
    for(var i = 0; i < this.objs.length; ++i) {
	this.objs[i].translate(vec_);
    }
    return this;
}

function _objsDraw(gl_) {
    for(var i = 0; i < this.objs.length; ++i) {
	this.objs[i].draw(gl_);
    }
    return this;
}

/** 
 *  Functions for low-level objects
 *  that contain single shapes
 */
function _oInitBuffers(gl_) {
    this.o.initBuffers(gl_);
    return this;
}

function _oDraw(gl_) {
    this.o.draw(gl_);
}

function _oDrawAgain(gl_) {
    this.o.drawAgain(gl_);
}

function _oTranslate(vec_) {
    this.o.translate(vec_);
    return this;
}

function _oScale(vec_) {
    this.o.scale(vec_);
    return this;
}

function _oInvertNorms() {
    var theNormData = this.o.data["norm"];
    for(var i = 0; i < theNormData.length; ++i) {
	theNormData[i] = -theNormData[i];
    }
    return this;
}

MatrixData.prototype.pause = function() { this.inc_ = 0; };
MatrixData.prototype.set = function(num) { this.val = num; };
MatrixData.prototype.setInc = function(num) {     
    this.inc_ = num; 
    this.inc();
    this.html.style.display = "inline-block"; 
};
MatrixData.prototype.inc = function() {
    this.val = (this.val + this.inc_) % 360; 
};

MatrixData.prototype.incBy = function(val) {
    this.val = (this.val + val) % 360; 
};

MatrixData.prototype.setIncZoom = function(num) { 
    this.val = this.val + num; 
    if(this.val > 180) this.val = 180;
    if(this.val < 0) this.val = 0;
};

MatrixData.prototype.setStoolHeight = function(num) { 
    this.val = this.val + num; 
    if(this.val > 4.375) this.val = 4.375;
    if(this.val < 0) this.val = 0;
};

MatrixData.prototype.dec = function() { 
    this.val = (this.val - this.inc_) % 360; };

MatrixData.prototype.reset = function() {
    this.val = 0;
    this.inc_ = 0; 
    this.html.style.display = "none"; };

MatrixData.prototype.isZero = function() {
    return(this.val === 0); };

function booleanData(htmlID){
    this.val = 1;
    this.html = document.getElementById(htmlID); 
}

booleanData.prototype.reset = function(){
    this.val = 1;
};

booleanData.prototype.toggle = function(){
    if(this.val === 0) this.val = 1;
    else this.val = 0;
    this.html.style.display = "inline-block";
};

var stoolHeight;
var rotateY;
var rotateCam;
var positionX;
var positionY;
var zoom;
var pause;
var priveledgedMode;

function resetModel() { 
    rotateY.reset(); 
    positionX.reset(); 
    positionY.reset(); 
    rotateCam.reset();
    zoom.set(45);
    pause.reset();
    stoolHeight.reset();
    priveledgedMode.reset();

}

function drawDashboard() {


    if(rotateCam.html.style.display === "inline-block") {
	rotateCam.html.innerHTML = "Rotation - Cam: " + rotateCam.val + "&deg;";
	rotateCam.inc();
    }
    if(rotateY.html.style.display === "inline-block") {
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
    if(priveledgedMode.html.style.display == "inline-block") {
	
	priveledgedMode.html.innerHTML = 
	    "<b>Player Controls</b> <br/>" +
	    "Arrow keys to move <br/>" +
	    "A and D to rotate";
	if(priveledgedMode.val == 1) {
	    priveledgedMode.html.innerHTML += 
	    "<br/><b>God Controls</b> <br/>" +
		"I and K to rotate up <br/>" +
		"A and D to rotate";
	    rotateY.html.innerHTML = "Rotation - Y: " + rotateY.val + "&deg;";
	}
    }

    zoom.inc();
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

    if(!stadiumMode){
	if(lightWillRotate) {
	    theMatrix.lightRotate(
		Math.PI / 180 * 2 * ((newX - mouseX) / 10), 
		Math.PI / 180 * 2 * ((newY - mouseY) / 10));
	} else {
	    theMatrix.lightTranslate(
		[(newX - mouseX) / 30, 
		 (mouseY - newY) / 30, 
		 0]);
	}
	mouseX = newX;
	mouseY = newY;
    }
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
	theMatrix.toggleSpeed();
	break;
    case 32: // spacebar
	theMatrix.jump();
	document.getElementById("keyboard").innerHTML = 
	    "Jump!";
	break;
    case 39: // ->
	theMatrix.moveLeft();
	document.getElementById("keyboard").innerHTML = 
	    "Jump!";
	break;
    case 37: // left
	theMatrix.moveRight();
	break;
    case 38: // up
	theMatrix.moveForward();
	break;
    case 40: // down
	theMatrix.moveBack();
	break;
    case 65: // a
	theMatrix.lookLeft();
	break;
    case 68: // d
	theMatrix.lookRight();
	break;	
    case 73: // i
	if(priveledgedMode.val)
	    theMatrix.lookUp();
	break;
    case 75: // k
	if(priveledgedMode.val)
	    theMatrix.lookDown();
	break;
    case 87: // w
	if(priveledgedMode.val)
	    theMatrix.moveUp();
	break;
    case 83: // s
	if(priveledgedMode.val)
	    theMatrix.moveDown();
	break;
    case 112: // F1: cycle through shaders 
	FLATNORMS = !FLATNORMS;
	theCanvas.changeShaders('shader-fs', 'shader-vs');
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

function expand(contentID, titleID) {
    document.getElementById("header").style.display = "none";
    document.getElementById("title2").style.display = "none";
    document.getElementById("footer").style.display = "none";

    var content = document.getElementById(contentID);
    if (content.style.display !== "inline-block") {
        content.style.display = "inline-block";
	if(titleID) {
            document.getElementById(titleID).style.color = '#555577';
        }
    } else {
        content.style.display = 'none';
	if(titleID) {
            var title = document.getElementById(titleID);
            title.style.width = '90%';
            title.style.color = '#111144';
	}
    }
}
