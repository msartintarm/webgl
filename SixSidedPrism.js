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
    var at,bt,ct,dt;
    at = vec2.fromValues(0.0,0.0);
    bt = vec2.fromValues(1.0,0.0);
    ct = vec2.fromValues(0.0,1.0);
    dt = vec2.fromValues(1.0,1.0);

    // Front and back faces.
    this.q1 = new Quad(a,b,d,c);
    this.q1.initTextures(bt,dt,at,ct);
    this.q2 = new Quad(h,g,e,f);
    this.q2.initTextures(bt,dt,at,ct);

    // Side faces.
    this.q3 = new Quad(d,c,h,g);
    this.q3.initTextures(bt,dt,at,ct);
    this.q4 = new Quad(e,f,a,b);
    this.q4.initTextures(bt,dt,at,ct);

    // Top and bottom faces.
    this.q5 = new Quad(c,b,g,f);
    this.q5.initTextures(bt,dt,at,ct);
    this.q6 = new Quad(h,e,d,a);
    this.q6.initTextures(bt,dt,at,ct);

};

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

