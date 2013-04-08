#  CS 559 Spring 2013: Project #2

**Title:** Caged

**Authors:** Michael Vello Sartin-Tarm, Christopher Richard Aberger

**Project Description:**  A webgl implementation of our IKEA DAFRED stool in 
    	        	  our special version of an environment.  Our environemnt is not the 
		    typical environment per-se; we make you earn the right to view our
		        stool by completing a maze.  At each dead end in the maze you will
			    see rotating objects (that we used to build the stool).  Finally
			        when you complete the maze, the heaven wall piece (you start out in
				    hell) you enter God mode where you have complete mobility.  You
				        also should notice our stools in a unique environment.  While 
					    moving through the maze you carry a light, whose position can 
					        be adjusted through use of the mouse.

**Features:** The project features the use of texturing, mesh-built objects, 
     phong and flat shading, debug windows, and custom built shaders.
         The code in this project was created from scratch by us.

**Movement:**  To move through the maze use the up, down, left, right, keys in
  	              order to move forward, backwards, left, and right respectively.
		             The 'a' and 'd' keys will cause the camera to look left and 
			            right respectively.  Once you complete the maze you get GOD 

**Movement (God Mode):**
        mode enabling extra mobility.  Specifically 'i' and 'j' will
	         allow the user to look 'up' and 'down' respectively.  The keys
		        'w' and 's' will allow the user to move up and down.

###Below is a detailed description of each file in the project.

##demo.html
	The html file that everything starts out of.  This file contains all 
	of the html elements pertinant to our webpage as well as the code
	that implements the vertex and fragment shaders.  In addition, 
	some important code with regard to texutres lies in this file.

##GLcanvas.js
	** Corresponds to HTML 'glcanvas' object **
	Contains the code that intializes much of the environment.  Shaders,
	textures, the skybox, and GL are all intialized here. -- This file 
	is the "start" of all of the javascript files in the start() function. -- 
	In addition this function takes in variables from the html code to 
	choose which objects to draw.  Finally this file contains the 
	draw scene function which is responsible for rendering the scene
	each frame.

##GLMatrix.js
	Composes the matrix class we use for our modelview, camera, and view
	matrices.  Here we have functions such as rotate and move to handle
	respective user movements with the matricies.
	** This allows us to only load new matrixes into the shaders if they
         have changed since their last load. **

##GLObject.js
	Holds the object class that we use when creating each respective 
	object (ex cylinder, sphere, etc...).  Here we have general functions
	such as addNormals or addPos that can be effectively utilized by each 
	function.  This class avoids a lot of useless code replication.

##functions.js
	Contains a wide variety of utility functions used within the project.
	Also contains function prototypes that are used by a variety of objects.

##webgl-utils and gl-matrix
	        Utility functions downloaded from the internet.

##Cylinder.js, Disk.js,  Quad.js, Sphere.js, Torus.js
        Uses composition as inheritance to interface away underlying GLobject.
 
##Light.js, Maze.js, MazePiece.js, SixSidedPrism.js, Skybox.js, Stool.js, StoolPyramid.js
	   Heirarchically uses classes defined in these files, and above files,
	   to create and render increasingly complex objects.

For example: GLobject -> Torus -> Stool -> StoolPyramid
