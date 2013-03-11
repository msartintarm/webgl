/*
b d
a c
*/
function Quad(a, b, c, d, at, bt, ct, dt) { 
    this.o = new GLobject();
    this.indexPos = 0;

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;

    this.at = at;
    this.bt = bt;
    this.ct = ct;
    this.dt = dt;

    this.o.addPosVec(a);
    this.o.addPosVec(b);   
    this.o.addPosVec(c);   
    this.o.addPosVec(d);

    var normalVec = crossVec3(subVec3(b,a), 
			      subVec3(c,a));
    for (var i = 0; i < 4; ++i) {
	this.o.addNormVec(normalVec);
	this.o.addColors(1, 0, 0);
    }

    this.o.addQuadIndexes(this.indexPos++,this.indexPos++,this.indexPos++,this.indexPos++);
  
    this.o.addTexture(this.at.x, this.at.y);  
    this.o.addTexture(this.bt.x, this.bt.y); 
    this.o.addTexture(this.ct.x, this.ct.y);  
    this.o.addTexture(this.dt.x, this.dt.y); 

    this.o.initBuffers();
};

Quad.prototype.draw = function() {
    this.o.drawBuffers();
};


