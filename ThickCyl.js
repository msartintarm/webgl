/**
   ThickCyl. 
 */
function ThickCyl(inner_radius, width, height, slices, stacks) { 

    this.topDisk = new Disk(
	inner_radius, inner_radius + width, slices, stacks).invertNorms();
    this.bottomDisk = new Disk(
	inner_radius, inner_radius + width, slices, stacks).translate([0, 0, height]);
    this.innerCyl = new Cylinder(
	inner_radius, inner_radius, height, slices, stacks).invertNorms();
    this.outerCyl = new Cylinder(
	inner_radius + width, inner_radius + width, height, slices, stacks);
    this.outerCyl.wrapText();

    return this;
}

ThickCyl.prototype.Disk = _Disk;
ThickCyl.prototype.Cyl = _Cyl;
ThickCyl.prototype.scale = _objsScale;
ThickCyl.prototype.setShader = _oSetShader;
ThickCyl.prototype.translate = _objsTranslate;
ThickCyl.prototype.scale = _objsScale;
ThickCyl.prototype.initBuffers = _objsInitBuffers;
ThickCyl.prototype.draw = _objsDraw;
