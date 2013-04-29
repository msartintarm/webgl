#####This page uses Github-flavored Markdown. 
- http://notepag.es is a useful browser-based Markdown editor.
- https://www.khronos.org/registry/webgl/specs/1.0/#2.1: Excellent WebGL specifications reference

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

##[A detailed description of each file in the project](DESCRIPTION.md).

##How to load a texture into WebGL
TODO instead, just link to a commit

####Find or create an image with these properties:
- less than 1.5 Mb in size 
- All sides have the same dimension, which is a power of 2

####In GLtexture.js:
- Create a const called xxx_TEXTURE paralleling existing ones, underneath all the others. It's important that the values for all the existing ones remain the same.
- Create an `else if` statement right above the final `else` using the const
- Set the content to one of these two strings:
   `} else if(this.index == xxx_TEXTURE) { this.img.src = "data:image/jpeg;base64,";` or
   `} else if(this.index == xxx_TEXTURE) { this.img.src = "data:image/png;base64,";`

####Convert the image into base64 encoding.
- At [this site](http://www.base64-image.de/)
- Upload the image
- Copy the raw data of the string
- Paste after the final comma within the string

####In demo.html:
- Add the uniform sampler variable for your specified texture.
- Navigate to the fragment shader - searching doc for `fs` is fast
- After the final `else` statement, add another `else if` - should be the highest number mentioned
- Feel free to mess with brightness or lighting values as some of the others do

####In [GLcanvas.js](GLcanvas.js)
- Add lines to find location for your new uniform variable.
- Add line to declare XXX_TEXTURE constant value (must be consistent with demo.html).
- Add line to init your texture.

Done! This gets passed to the buffer and set in GLobject.js. `NO_TEXTURE` is the default value loaded if none is set.

##[How to Use Git](GIT.md)
