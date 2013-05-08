       /*================================*/
      /*================================*/
     /*= It's just too time-consuming =*/
    /*== to support things we don't ==*/
   /*=== particularly love, like ====*/
  /*========= flat norms. ==========*/
 /*================================*/
/*================================*/

function GLobject() {
    this.hasFlatNorms = false;
}

/**
 * Sometimes, we'll have to invert the norms 
 *  of objects
 */
GLobject.prototype.invertFlatNorms = function() {
    for (var i = 0; i < this.data["norm_"].length; ++i) {
	this.data["norm_"][i] = -this.data["norm_"][i];
    }
};
var FLATNORMS = false;

/**
   Each quad is made up of four triangles, and hence, 
   the norms -can- be calculated solely through their
   positions. 

   All position data must be stable before this point.
*/
GLobject.prototype.initFlatNorms = function() {

    alert("flat norms are unsupported now. Danger!"); return;
    
    if(FLATNORMS === false || this.hasFlatNorms === true) return;
    this.hasFlatNorms = true;

    var a, b, c, d;
    a = vec3.create();
    b = vec3.create();
    c = vec3.create();
    d = vec3.create();

    this.data["index_"] = [];
    this.data["norm_"] = [];
    this.data["col_"] = [];
    this.data["pos_"] = []; 
    this.data["tex_"] = [];
    // We'll go over one triangle (3 indexes, 3 * data_size elements for each new buffer)
    // This will mean the new buffers will have 3/2 as many elements
    var i = 0;
    while(i < this.data["index"].length) {

	// Load up every element
	this.data["index_"].push(i);
	ind = this.data["index"][i];
	this.data["col_"].push( this.data["col"][ind * 3] );
	this.data["col_"].push( this.data["col"][ind * 3 + 1] );
	this.data["col_"].push( this.data["col"][ind * 3 + 2] );
	this.data["pos_"].push( this.data["pos"][ind * 3] );
	this.data["pos_"].push( this.data["pos"][ind * 3 + 1] );
	this.data["pos_"].push( this.data["pos"][ind * 3 + 2] );
	this.data["tex_"].push( this.data["tex"][ind * 2] );
	this.data["tex_"].push( this.data["tex"][ind * 2 + 1] );
	vec3.set(a, this.data["pos"][ind * 3], 
		    this.data["pos"][ind * 3 + 1], 
		    this.data["pos"][ind * 3 + 2]); 
	i++;
	// 3 times. Only the vector that's set changes.
	this.data["index_"].push(i);
	ind = this.data["index"][i];
	this.data["col_"].push( this.data["col"][ind * 3] );
	this.data["col_"].push( this.data["col"][ind * 3 + 1] );
	this.data["col_"].push( this.data["col"][ind * 3 + 2] );
	this.data["pos_"].push( this.data["pos"][ind * 3] );
	this.data["pos_"].push( this.data["pos"][ind * 3 + 1] );
	this.data["pos_"].push( this.data["pos"][ind * 3 + 2] );
	this.data["tex_"].push( this.data["tex"][ind * 2] );
	this.data["tex_"].push( this.data["tex"][ind * 2 + 1] );
	vec3.set(b, this.data["pos"][ind * 3], 
		    this.data["pos"][ind * 3 + 1], 
		    this.data["pos"][ind * 3 + 2]); 
	i++;
	// Last time.
	this.data["index_"].push(i);
	ind = this.data["index"][i];
	this.data["col_"].push( this.data["col"][ind * 3] );
	this.data["col_"].push( this.data["col"][ind * 3 + 1] );
	this.data["col_"].push( this.data["col"][ind * 3 + 2] );
	this.data["pos_"].push( this.data["pos"][ind * 3] );
	this.data["pos_"].push( this.data["pos"][ind * 3 + 1] );
	this.data["pos_"].push( this.data["pos"][ind * 3 + 2] );
	this.data["tex_"].push( this.data["tex"][ind * 2] );
	this.data["tex_"].push( this.data["tex"][ind * 2 + 1] );
	vec3.set(c, this.data["pos"][ind * 3], 
		    this.data["pos"][ind * 3 + 1], 
		    this.data["pos"][ind * 3 + 2]); 
	i++;
	// Calc norms for these 3 triangles.
	vec3.sub(b, b, a);
	vec3.sub(c, c, a);
	vec3.cross(c, c, b);
	vec3.normalize(c, c);

	this.data["norm_"].push(c[0]);
	this.data["norm_"].push(c[1]);
	this.data["norm_"].push(c[2]);
	this.data["norm_"].push(c[0]);
	this.data["norm_"].push(c[1]);
	this.data["norm_"].push(c[2]);
	this.data["norm_"].push(c[0]);
	this.data["norm_"].push(c[1]);
	this.data["norm_"].push(c[2]);
    }

    if(this.normsInverted) { this.invertFlatNorms(); }

};
