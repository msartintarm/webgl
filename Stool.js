const base_leg_distance = (19.625/2)/6;
const base_leg_width = (0.6/6);
const min_stool_height = 24.75/6;
const tilt = -min_stool_height*Math.sin(15*(Math.PI/180));
const seat_radius = (11.75/2)/60
var colorVec;

function Stool() { 
    var x_ = base_leg_width;
    var y_ = min_stool_height;
    var z_offset = base_leg_distance;
    var z_ = base_leg_width;
    this.stoolLeg = new SixSidedPrism(
	  new vec3( x_,  y_,  z_ + z_offset + tilt),
	  new vec3( x_,   0,  z_ + z_offset),
	  new vec3( x_,   0, -z_ + z_offset),
	  new vec3( x_,  y_, -z_ + z_offset + tilt),
	  new vec3(-x_,  y_,  z_ + z_offset + tilt),
	  new vec3(-x_,   0,  z_ + z_offset),
	  new vec3(-x_,   0, -z_ + z_offset),
	  new vec3(-x_,  y_, -z_ + z_offset + tilt)
    );

    this.disk1t = new Disk(0.01,0.047,30,30);
    this.cylinder1 = new Cylinder(0.047,0.05,0.015,30,30);
    this.disk1b = new Disk(0.015,0.05,30,30);
    colorVec.setvec(new vec3(1,0,0));
    this.cylinder2 = new Cylinder(0.015,0.015,0.06,30,300); 

    colorVec.setvec(new vec3(0,1,1));
    this.disk3t = new Disk(0.015,0.065,30,30);
    this.cylinder3 = new Cylinder(0.065,0.070,0.015,30,30);
    this.disk3b = new Disk(0.015,0.070,30,30);
    this.torus1 = new Torus(0.008,0.115);
    this.torus1.o.translate([0,0,0]);

    //moving parts
    colorVec.setvec(new vec3(0.5,0,1));
    this.disk4 = new Disk(0,seat_radius,30,30);
    this.cylinder4 = new Cylinder(seat_radius,seat_radius,0.005,30,30);
    this.cylinder5 = new Cylinder(seat_radius,seat_radius/2,0.0075,30,30);
    colorVec.setvec(new vec3(1,1,1));
    this.cylinder6 = new Cylinder(seat_radius/2,seat_radius/4,0.0015,30,30);
    colorVec.setvec(new vec3(0,1,1));
    this.cylinder7 = new Cylinder(seat_radius/4,0.01,0.006,30,30);
    colorVec.setvec(new vec3(0,0,1));
    this.cylinder8 = new Cylinder(0.01,0.01,0.16,30,30);
    colorVec.setvec(new vec3(1,1,1));
    this.disk5 = new Disk(0,0.003,30,30);

    
}

Stool.prototype.draw = function() {

    //draws the legs of the stool
    for (var i = 0; i < 4; ++i) {
	theMatrix.rotate(Math.PI/2, [0, 1.0, 0]);
	this.stoolLeg.draw();
    }
    
    //draw first fat cylinder
    theMatrix.push();
    theMatrix.translate([0,min_stool_height,0]);
    theMatrix.scale([12,12,12]);    
    theMatrix.rotate(Math.PI/2, [1, 0, 0]);

    this.disk1t.draw();
    this.cylinder1.draw();
    theMatrix.translate([0,0,0.015]);
    this.disk1b.draw();

    //draw long cylinder between two fats
    this.cylinder2.draw();

    //draw bottom fat cylinder
    theMatrix.translate([0,0,0.06]);
    this.disk3t.draw();
    this.cylinder3.draw();
    theMatrix.translate([0,0,0.015]);
    this.disk3b.draw();

    //draw torus
    theMatrix.translate([0,0,0.2]);
    theMatrix.rotate(-Math.PI/2, [1, 0, 0]);
    this.torus1.draw();

    theMatrix.pop();

    //moving parts
    theMatrix.push();
    seat_height = stoolHeight.val;
    var seat_location = min_stool_height + 12*(seat_height/60)+12*0.02;
    theMatrix.translate([0,seat_location,0]);
    theMatrix.rotate((seat_height/4.375)*100*Math.PI, [0, 1, 0]);
    theMatrix.rotate(Math.PI/2, [1, 0, 0]);
    theMatrix.scale([12,12,12]); 
    this.disk4.draw();
    this.cylinder4.draw();

    theMatrix.translate([0,0,0.005]);
    this.cylinder5.draw();
    theMatrix.translate([0,0,0.0075]);
    this.cylinder6.draw();
    theMatrix.translate([0,0,0.0015]);
    this.cylinder7.draw();
    theMatrix.translate([0,0,0.006]);
    this.cylinder8.draw();

    theMatrix.rotate(-Math.PI/2, [1, 0, 0]);
    theMatrix.translate([0,-0.13,0]);
//    var copy = mat4.create();
//    mat4.set(mvMatrix,copy);
    for(var i=0;i<0.12;i=i+0.0001){
//	mat4.set(copy,mvMatrix);
//	theMatrix.translate([0, .0001, 0]);
//	theMatrix.rotate(1, [0, 1/16 * Math.PI, 0]);
//	theMatrix.translate([0, 0, 0.011]);
//	this.disk5.draw();
	}
    theMatrix.pop();
    
}
