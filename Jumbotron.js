/**
   A four-screen Jumbotron. Modeled from
   http://upload.wikimedia.org/wikipedia/commons/e/ee/TD_Banknorth_Garden_Jumbotron.jpg

   Distances measured in pixels
*/
function Jumbotron() { 

    // ThickCyl: inner_radius, width, height, slices, stacks
    // disk: inner_radius, outer_radius, slices, loops
    // cylinder: base_radius, top_radius, height, slices, stacks

    this.thickCylA = new ThickCyl(773, 34, 114, 60, 30);
    this.thickCylB = new ThickCyl(758, 37, 171, 60, 30).translate([0, 0, 220]);

    this.PrismA = new RectangularPrism(
	[109, - 220 - 171 - 150, -709],
	[68, -709 - 500, 220 + 171 + 150],

);

    colorVec = [0,0,.5];
    return this;
}

Stool.prototype.Prism = _Prism;
Stool.prototype.Disk = _Disk;
Stool.prototype.Cyl = _Cyl;
Stool.prototype.Torus = _Torus;

Stool.prototype.initBuffers = _objsInitBuffers;

var seat_location;
Stool.prototype.draw = function(gl_) {
    seat_height = stoolHeight.val;
    seat_location = min_stool_height + 12*(seat_height/60)+12*0.02;

    //draws the legs of the stool
    for (var i = 0; i < 4; ++i) {
	theMatrix.rotate(Math.PI/2, [0, 1.0, 0]);
	this.stoolLeg.draw(gl_);
    }
    
    //draw first fat cylinder
    theMatrix.push();
    theMatrix.translate([0,min_stool_height,0]);
    theMatrix.scale([12,12,12]);    
    theMatrix.rotate(Math.PI/2, [1, 0, 0]);

    this.disk1t.draw(gl_);
    this.cylinder1.draw(gl_);
    theMatrix.translate([0,0,0.015]);
    this.disk1b.draw(gl_);

    //draw long cylinder between two fats
    this.cylinder2.draw(gl_);

    //draw bottom fat cylinder
    theMatrix.translate([0,0,0.06]);
    this.disk3t.draw(gl_);
    this.cylinder3.draw(gl_);
    theMatrix.translate([0,0,0.015]);
    this.disk3b.draw(gl_);

    //draw torus
    theMatrix.translate([0,0,0.2]);
    theMatrix.rotate(-Math.PI/2, [1, 0, 0]);
    this.torus1.draw(gl_);

    theMatrix.pop();

    //moving parts
    theMatrix.push();
    theMatrix.translate([0,seat_location,0]);
    theMatrix.rotate((seat_height/4.375)*100*Math.PI, [0, 1, 0]);
    theMatrix.rotate(Math.PI/2, [1, 0, 0]);
    theMatrix.scale([12,12,12]); 
    this.disk4.draw(gl_);
    this.cylinder4.draw(gl_);

    theMatrix.translate([0,0,0.005]);
    this.cylinder5.draw(gl_);
    theMatrix.translate([0,0,0.0075]);
    this.cylinder6.draw(gl_);
    theMatrix.translate([0,0,0.0015]);
    this.cylinder7.draw(gl_);
    theMatrix.translate([0,0,0.006]);
    this.cylinder8.draw(gl_);

    theMatrix.pop();
    
}
