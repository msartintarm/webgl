var rotateY;

function ClosedCyl(
    cyl_base_radius, 
    cyl_top_radius, 
    cyl_height, 
    cyl_stacks,
    top_disk_inner_radius, 
    base_disk_inner_radius, 
    disk_loops, 
    slices) { 
    this.objs = [new Cylinder(cyl_base_radius, 
				 cyl_top_radius, 
				 cyl_height, 
				 slices, 
				 cyl_stacks),
		    new Disk(
			top_disk_inner_radius, 
			cyl_top_radius, 
			slices,
			disk_loops),
		    new Disk(
			base_disk_inner_radius, 
			cyl_top_radius, 
			slices,
			disk_loops).invertNorms()
		   ];    
}

ClosedCyl.prototype.initBuffers = function(gl_) {
    for(var i = 0; i< this.objs.length; ++i) {
	this.objs[i].initBuffers(gl_);
    }
}

ClosedCyl.prototype.draw = function(gl_, buffer_) {
    for(var i = 0; i< this.objs.length; ++i) {
	this.objs[i].drawBuffers(gl_, buffer_);
    }
};
