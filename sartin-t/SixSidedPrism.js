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
    this.objs = []
    var at,bt,ct,dt;
    at = vec2.fromValues(0.0,0.0);
    bt = vec2.fromValues(1.0,0.0);
    ct = vec2.fromValues(0.0,1.0);
    dt = vec2.fromValues(1.0,1.0);

    // Front and back faces.
    this.q1 = this.Quad(a,b,d,c);
    this.q2 = this.Quad(h,g,e,f);

    // Side faces.
    this.q3 = this.Quad(d,c,h,g);
    this.q4 = this.Quad(e,f,a,b);

    // Top and bottom faces.
    this.q5 = this.Quad(c,b,g,f);
    this.q6 = this.Quad(h,e,d,a);
    return this;
};

SixSidedPrism.prototype.Quad = _Quad;
SixSidedPrism.prototype.translate = _objsTranslate;

SixSidedPrism.prototype.setTexture = function(texture) {
    for(var i = 0; i < this.objs.length; ++i) {
	this.objs[i].setTexture(texture);
    }
    return this;
}

SixSidedPrism.prototype.initBuffers = function(gl_) {
    this.q1.initBuffers(gl_);
    this.q2.initBuffers(gl_);
    this.q3.initBuffers(gl_);
    this.q4.initBuffers(gl_);
    this.q5.initBuffers(gl_);
    this.q6.initBuffers(gl_);
};

SixSidedPrism.prototype.draw = function(gl_, shaders_) {

    this.q1.draw(gl_, shaders_);
    this.q2.draw(gl_, shaders_);
    this.q3.draw(gl_, shaders_);
    this.q4.draw(gl_, shaders_);
    this.q5.draw(gl_, shaders_);
    this.q6.draw(gl_, shaders_);
};

