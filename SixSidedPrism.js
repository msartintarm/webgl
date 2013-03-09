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
    this.indexPos = 0;

    // Front and back faces.
    this.Quad(a, b, d, c);
    this.Quad(h, g, e, f);

    // Side faces.
    this.Quad(d, c, h, g);
    this.Quad(e, f, a, b);

    // Top and bottom faces.
    this.Quad(c, b, g, f);
    this.Quad(h, e, d, a);
    
    this.o.initBuffers();
};

SixSidedPrism.prototype.draw = function() {
    this.o.drawBuffers();
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
}

