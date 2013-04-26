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

Quad.prototype.setTexture = function(texture) { 
    this.o.setTexture(texture);
    this.o.initTextures([1,0], [1,1], [0,0], [0,1]);
    return this;
}

Quad.prototype.setSkyTexture = function(texture, val) { 
    this.o.setTexture(texture);
   
    
    //it is not trivial to get these coordinates to work for an image
    //so do not foolishly rush in here.
    if(val== 0){
	//set the south wall	
	this.o.initTextures([0.249999,0.749999], [0,0.7499999], [0.2499999,0.499999], [0,0.499999]);
	//this.o.initTextures([0.2499999,0.2499999], [0.2499999,0], [0.499999,0.2499999], [0.499999,0]);
    }
    else if(val == 1){
	//north wall
	this.o.initTextures([0.499999,0.499999], [0.7499999,0.499999], [0.499999,0.7499999], [0.7499999,0.7499999]);
    }
    else if(val == 2){
	//east wall
	this.o.initTextures([0.2499999,0.499999], [0.2499999,0.2499999], [0.499999,0.499999], [0.499999,0.2499999]);
    }
    else if(val == 3){
	//west wall
	this.o.initTextures([0.499999,0.7499999], [0.499999,0.99999], [0.2499999,0.7499999], [0.2499999,0.99999]);
    }
    else if(val == 4){
	//bottom wall
	this.o.initTextures([0.99999,0.499999], [0.99999,0.7499999], [0.7499999,0.499999], [0.7499999,0.7499999]);
    }
    else{
	//top wall
	this.o.initTextures([0.499999,0.499999], [0.499999,0.7499999], [0.2499999,0.499999],[0.2499999,0.7499999]);
    }
    return this;
}


Quad.prototype.initBuffers = _oInitBuffers;
Quad.prototype.translate = _oTranslate;

Quad.prototype.draw = _oDraw;
