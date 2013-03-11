/**
   Front face (facing X):    Back face (facing X):
    AD                        EH
    BC         E----H         FG
              /|   /|
             A----D |           
             | F -|-G          
             |/   |/            
             B----C             
 */
function SixSidedPrism(a, b, c, d, e, f, g, h) { 

    this.o = new GLobject();

    // Front and back faces.
    this.o.Quad(a, b, d, c);
    this.o.Quad(h, g, e, f);

    // Side faces.
    this.o.Quad(d, c, h, g);
    this.o.Quad(e, f, a, b);

    // Top and bottom faces.
    this.o.Quad(c, b, g, f);
    this.o.Quad(h, e, d, a);
};

/**
   Buffers a quadrilateral.
 */
SixSidedPrism.prototype.Quad = function(a, b, c, d) { 
    this.o.addPosVec(a);
    this.o.addPosVec(b);   
    this.o.addPosVec(c);   
    this.o.addPosVec(d);

    var normalVec = crossVec3(subVec3(b,a), 
			      subVec3(c,a));
    for (var i = 0; i < 4; ++i) {
	this.o.addNormVec(normalVec);
	this.o.addColors(.3, .5, .7);
    }
    this.o.addQuadIndexes(this.indexPos++,
			  this.indexPos++,
			  this.indexPos++,
			  this.indexPos++);

    //not correct, to add texture this should be adjusted
    this.o.addTexture(0.0, 0.0);  
    this.o.addTexture(1.0, 1.0); 
    this.o.addTexture(0.0, 0.0);  
    this.o.addTexture(1.0, 1.0);
}

SixSidedPrism.prototype.initBuffers = function(gl_) {
    this.o.initBuffers(gl_);
};

SixSidedPrism.prototype.draw = function(gl_, shaders_) {
    this.o.drawBuffers(gl_, shaders_);
};

