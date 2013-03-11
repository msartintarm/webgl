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

SixSidedPrism.prototype.initBuffers = function(gl_) {
    this.o.initBuffers(gl_);
}

SixSidedPrism.prototype.draw = function(gl_, buffer_) {
    this.o.drawBuffers(gl_, buffer_);
};

