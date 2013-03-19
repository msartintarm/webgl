/*
a c 
b d
*/
function Quad(a, b, c, d) { 
    this.o = new GLobject();
    this.indexPos = 0;

    this.o.addPosVec(a);
    this.o.addPosVec(b);   
    this.o.addPosVec(c);   
    this.o.addPosVec(d);

    var temp1 = vec3.create();
    var temp2 = vec3.create();
    var normV = vec3.create();

    vec3.cross(normV, vec3.sub(temp2,c,a), vec3.sub(temp1,b,a));
    vec3.normalize(normV, normV);
    for (var i = 0; i < 4; ++i) {
	this.o.addNormVec(normV);
	this.o.addColors(0.2, 0.5, 0.7);
    }

    this.o.addQuadIndexes(
	this.indexPos,
	this.indexPos + 2);
    this.indexPos += 4;
  
}


Quad.prototype.invertNorms = _oInvertNorms;

Quad.prototype.initTextures = function(at, bt, ct, dt) { 
    this.o.addTexture(at[0], at[1]);
    this.o.addTexture(bt[0], bt[1]);
    this.o.addTexture(ct[0], ct[1]); 
    this.o.addTexture(dt[0], dt[1]);
    return this;
}

Quad.prototype.setTexture = function(texture) { 
    this.o.setTexture(texture);
    this.initTextures([0,1], [0,0], [1,1], [1,0]);
    return this;
}

Quad.prototype.initBuffers = _oInitBuffers;
Quad.prototype.translate = _oTranslate;

Quad.prototype.draw = _oDraw;
