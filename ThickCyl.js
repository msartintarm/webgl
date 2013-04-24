/**
   ThickCyl. 
 */
function ThickCyl(inner_radius, width, height, slices, stacks) { 
    this.objs = [];

    this.topDisk = this.Disk(
	inner_radius, inner_radius + width, height, slices, stacks);
    this.bottomDisk = this.Disk(
	inner_radius, inner_radius + width, height, slices, stacks)
	.translate([0, 0, height])
	.invertNorms();
    this.innerCylA = this.Cyl(
	inner_radius, inner_radius, height, slices, stacks)
	.translate([0, height, 0]);
    this.outerCylA = this.Cyl(
	inner_radius + width, inner_radius + width, height, slices, stacks)
	.translate([0, 0, height])
	.invertNorms();

    return this;
};

ThickCyl.prototype.Disk = _Disk;
ThickCyl.prototype.Cyl = _Cyl;
ThickCyl.prototype.translate = _objsTranslate;


ThickCyl.prototype.initBuffers = _objsInitBuffers;

ThickCyl.prototype.draw = _objsDraw;
