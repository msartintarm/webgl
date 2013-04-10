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

##Below is a detailed description of each file in the project.

###demo.html
 The html file that everything starts out of.  This file contains all 
of the html elements pertinant to our webpage as well as the code
that implements the vertex and fragment shaders.  In addition, 
some important code with regard to texutres lies in this file.

###GLcanvas.js
**Corresponds to HTML 'glcanvas' object**
 
Contains the code that intializes much of the environment.  Shaders,
	 textures, the skybox, and GL are all intialized here. -- This file 
	 is the "start" of all of the javascript files in the start() function. -- 
	 In addition this function takes in variables from the html code to 
	 choose which objects to draw.  Finally this file contains the 
	 draw scene function which is responsible for rendering the scene
	 each frame.

###GLMatrix.js
Composes the matrix class we use for our modelview, camera, and view
	 matrices.  Here we have functions such as rotate and move to handle
	 respective user movements with the matricies.
	 **This allows us to only load new matrixes into the shaders if they
         have changed since their last load.**

###GLObject.js
Holds the object class that we use when creating each respective 
      object (ex cylinder, sphere, etc...).  Here we have general functions
      such as addNormals or addPos that can be effectively utilized by each 
      function.  This class avoids a lot of useless code replication.

###functions.js
Contains a wide variety of utility functions used within the project.
	 Also contains function prototypes that are used by a variety of objects.

###webgl-utils and gl-matrix
Utility functions downloaded from the internet.

###Cylinder.js, Disk.js,  Quad.js, Sphere.js, Torus.js
Uses composition as inheritance to interface away underlying GLobject.
 
###Light.js, Maze.js, MazePiece.js, SixSidedPrism.js, Skybox.js, Stool.js, StoolPyramid.js
Heirarchically uses classes defined in these files, and above files,
	          to create and render increasingly complex objects.

For example: GLobject -> Torus -> Stool -> StoolPyramid

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
- At this site: demddasd
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

##How to Use Git
This isn't directly related to the project, but it's pretty important for the (two) 
  contributors to know how to properly configure and use Git.

Checking the project out: `git clone https://github.com/msartintarm/webgl.git .`
Viewing changes after files are modified: `git status`

####Config
- We don't want Emacs backup files with a trailing `~` to be seen by Git: `echo "*~" >> .gitignore`
- All commits get pushed to their upstream remote branch: `git config --global push.default upstream`
- Rebase from remote branches by default: `git config --global branch.autosetuprebase remote`

###Workflow in Git
To do a task 
- Update code to latest version: `git fetch; git rebase origin/master` OR `git pull` (config adds `--rebase` flag)
- Create and switch to the new branch: `git checkout -b the_task origin/master`
- This also sets the remote branch as upstream
- make changes ...
- commit changes: `git commit -am "i did something good"`
- notice you forgot something: `git commit -a --amend`
- `git status` - if your branch is behind its upstream version, do a rebase
- Send commit to origin/master to close it: `git push --rebase`

###Git Rebase
After you commit but before you push your changes to the remote branch, you have to
 apply any changes made to it since you last modified your code.
- `git rebase origin/master`
- Git will tell you if it can't merge a file automatically.
- Browse affected files and select the right code to keep
- Add file again to resolve: `git add file.js`
- Mark rebase as resolved: `git rebase --continue`
- Check to ensure everything works before you push.
- If you screw your files up in the rebase, abort and try again: `git rebase --abort`

###Misc. Git stuff
- Create a new Github repository: `git remote add masterBranch git@github.com:msartintarm/the_project.git`
- See active repositories: `git remote -v`
- See which changes are in the current branch: `git log [--oneline]` 
- See all changes in every branch at once: `git log --graph --all --oneline`
- See which branches (local and remote) exist: `git branch -a`
- Marking a version in your project: `git tag -a v_1.0 -m "version 1 out"`
- Showing important versions: `git tag` or `git show v_1.0`
