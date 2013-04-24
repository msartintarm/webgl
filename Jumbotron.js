/**
   A four-screen Jumbotron. Modeled from
   http://upload.wikimedia.org/wikipedia/commons/e/ee/TD_Banknorth_Garden_Jumbotron.jpg

   Distances measured in pixels
*/
function Jumbotron() { 

    // ThickCyl: inner_radius, width, height, slices, stacks
    // 3 Thick Cyls in the Jumbotron

    var radiusA = 773;
    var radiusB = 758;

    var widthA = 34;
    var widthB = 37;
    
    var heightA = 114;
    var heightB = 171;

    var distB = heightA + 106;

    var slices = 60;
    var stacks = 60;

    this.thickCylA = new ThickCyl(radiusA, widthA, heightA, slices, stacks);
    this.thickCylB = new ThickCyl(radiusB, widthB, heightB, slices, stacks)
	.translate([0, 0, distB]);

    // RectangularPrism: a, b, c, d, width
    // The Jumbotrons's screen's corners are symmetrical to the center of the plane,
    // and near the second and third ThickCyl.
    var angleA = Math.PI / 32;
    var angleB = (Math.PI / 2) - angleA;
    var angleC = Math.PI / 64;
    var angleD = (Math.PI / 2) - angleC;
    var distScreen = -distB - heightB - 110;
    var heightScreen = 600; // TODO: actually measure (MST)

    var widthScreen = 50;   // TODO: actually measure (MST)

    var a = vec3.create();
    var b = vec3.create();
    var c = vec3.create();
    var d = vec3.create();

    // sin(angleA) = cos(angleB)
    // cos(angleB) = sin(angleA)
    a[0] = Math.cos(angleB) * radiusA;
    a[2] = Math.sin(angleB) * radiusA;
    d[0] = a[2];
    d[2] = a[0];
    a[1] = distScreen;
    d[1] = distScreen;

    b[0] = Math.cos(angleD) * (radiusA - 140);
    b[2] = Math.sin(angleD) * (radiusA - 140);
    c[0] = b[2];
    c[2] = b[0];
    b[1] = distScreen - heightScreen;
    c[1] = distScreen - heightScreen;

    this.frame = new GLframe(FRAME_BUFF);

    this.jumboScreen = SixSidedPrism.rectangle(a, b, c, d, widthScreen)
	.setSixTextures(NO_TEXTURE, FRAME_BUFF, NO_TEXTURE,
			NO_TEXTURE, NO_TEXTURE, NO_TEXTURE) ;
    return this;
}

Jumbotron.prototype.initBuffers = function(gl_) {
    this.frame.init(gl_);
    this.thickCylA.initBuffers(gl_);
    this.thickCylB.initBuffers(gl_);
    this.jumboScreen.initBuffers(gl_);
}

Jumbotron.prototype.draw = function(gl_) {

    this.frame.drawScene(gl_);
    theMatrix.scale([0.05, 0.05, 0.05]);
    theMatrix.push();
    theMatrix.rotate(Math.PI / 2, [1, 0, 0]);
    this.thickCylA.draw(gl_);
    this.thickCylB.draw(gl_);
    theMatrix.pop();
    for(var i = 0; i < 4; ++i) {
	this.jumboScreen.draw(gl_);
	theMatrix.rotate(Math.PI / 2, [0, 1, 0]);
    }

}
