<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN'
	  'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<!-- All text on this page is property of Michael Sartin-Tarm. (c) 2013. -->
<html xmlns='http://www.w3.org/1999/xhtml'>
  <head>
    <meta http-equiv='Content-Type' content='text/html charset=utf-8'/>
    <title>WebGL Demo</title>
    <link rel='stylesheet' type='text/css' href='styles.css'/>
    <link rel='icon' type='image/x-icon' href='./favicon.ico'/>
    <link rel="stylesheet" href="webgl.css" type="text/css">
    <script src="libs/gl-matrix.js" type="text/javascript"></script> 
    <script src="libs/webgl-utils.js" type="text/javascript"></script>
    <script src="functions.js" type="text/javascript"></script>
    <script src="GLobject.js" type="text/javascript"></script>
    <script src="GLmatrix.js" type="text/javascript"></script>
    <script src="Cylinder.js" type="text/javascript"></script>
    <script src="Stool.js" type="text/javascript"></script>
    <script src="StoolPyramid.js" type="text/javascript"></script>
    <script src="Sphere.js" type="text/javascript"></script>
    <script src="Torus.js" type="text/javascript"></script>
    <script src="Disk.js" type="text/javascript"></script>
    <script src="Floor.js" type="text/javascript"></script>
    <script src="Light.js" type="text/javascript"></script>
    <script src="Quad.js" type="text/javascript"></script>
    <script src="SixSidedPrism.js" type="text/javascript"></script>
    <script src="Floor.js" type="text/javascript"></script>
    <script src="Maze.js" type="text/javascript"></script>
    <script src="Skybox.js" type="text/javascript"></script>
    <script src="MazePiece.js" type="text/javascript"></script>
    <script src="GLcanvas.js" type="text/javascript"></script>
    <script id="shader-fs" type="x-shader/x-fragment">
precision mediump float;

varying float diffuseV;
varying float specularV;
varying float textureNumV;
varying vec3 colorV;

varying vec2 textureV;
uniform sampler2D samplerU;
uniform sampler2D woodU;
uniform sampler2D rugU;
uniform sampler2D heavenU;
uniform sampler2D hellU;
uniform sampler2D floorU;
uniform sampler2D operaU;
uniform sampler2D brickU;
uniform sampler2D tileU;
uniform sampler2D noU;
uniform sampler2D sky1U;
uniform sampler2D sky2U;
uniform sampler2D sky3U;
uniform sampler2D sky4U;
uniform sampler2D sky5U;
uniform sampler2D sky6U;
uniform float uUseTexture;

void main(void) {


 vec4 textureColor;

if (textureNumV < 0.1) {
  textureColor = texture2D(
    woodU, 
    vec2(textureV.s, textureV.t));
} else if (textureNumV < 1.1) {
  textureColor = texture2D(
    heavenU, 
    vec2(textureV.s, textureV.t));
} else if (textureNumV < 2.1) {
  textureColor = texture2D(
    hellU, 
    vec2(textureV.s, textureV.t));
} else if (textureNumV < 3.1) {
  textureColor = texture2D(
    floorU, 
    vec2(textureV.s, textureV.t));
} else if (textureNumV < 4.1) {
  textureColor = texture2D(
    operaU, 
    vec2(textureV.s, textureV.t));
} else if (textureNumV < 5.1) {
  textureColor = texture2D(
    brickU, 
    vec2(textureV.s, textureV.t));
} else if (textureNumV < 6.1) {
  textureColor = texture2D(
    tileU, 
    vec2(textureV.s, textureV.t));
} else if (textureNumV < 7.1) {
  textureColor = vec4(colorV, 1.0);
} else if (textureNumV < 8.1) {
  textureColor = texture2D(
    sky1U, 
    vec2(textureV.s, textureV.t));
} else if (textureNumV < 9.1) {
  textureColor = texture2D(
    sky2U, 
    vec2(textureV.s, textureV.t));
} else if (textureNumV < 10.1) {
  textureColor = texture2D(
    sky3U, 
    vec2(textureV.s, textureV.t));
} else if (textureNumV < 11.1) {
  textureColor = texture2D(
    sky4U, 
    vec2(textureV.s, textureV.t));
} else if (textureNumV < 12.1) {
  textureColor = texture2D(
    sky5U, 
    vec2(textureV.s, textureV.t));
} else if (textureNumV < 13.1) {
  textureColor = texture2D(
    sky6U, 
    vec2(textureV.s, textureV.t));
}
 else if (textureNumV < 14.1) {
  textureColor = texture2D(
    rugU, 
    vec2(textureV.s, textureV.t));
} else {
  textureColor = vec4(colorV, 1.0);
}

  vec3 colorV2 = textureColor.rgb / 1.5;
  vec3 ambColor = colorV2 * 0.1;
  vec3 diffColor = colorV2 * diffuseV * 0.7;
  vec3 specColor = vec3(.8,.8,.8) * specularV;

  vec4 vertColor = vec4(ambColor + diffColor + specColor, 1.0);

  gl_FragColor = vertColor;
}
    </script>
    <script id="frag-shader-flat" type="x-shader/x-fragment">
  vec3 colorV2 = textureColor.rgb / 1.5;
  vec3 ambColor = colorV2 * 0.1;
  vec3 diffColor = colorV2 * diffuseV * 0.7;
  vec3 specColor = vec3(.8,.8,.8) * specularV;

  vec4 vertColor = vec4(ambColor + diffColor + specColor, 1.0);

  gl_FragColor = vertColor;
}
    </script>
    <script id="shader-vs" type="x-shader/x-vertex">
precision mediump float;

// Vector Attributes
attribute vec3 vPosA;
attribute vec3 vNormA;
attribute vec3 vColA;
attribute vec2 textureA;
attribute float textureNumA;

// Matrixes
uniform mat4 pMatU; // Position
uniform mat4 mMatU; // Model
uniform mat4 vMatU; // View
uniform mat4 nMatU; // Normal
uniform mat4 lMatU; // Lighting

// Position attributes
uniform vec3 lightPosU;
uniform vec3 viewPosU;

// Passed to the fragment shader
varying float diffuseV;
varying float specularV;
varying float textureNumV;
varying vec3 colorV;
varying vec2 textureV;

void main(void) {

textureNumV = textureNumA;

// Pre-viewing space coordinates of light / vertex
vec4 vModel = vMatU * mMatU  * vec4(vPosA, 1.0);
vec4 lModel = vMatU * lMatU * vec4(lightPosU, 1.0);

  // -- Position -- //

  gl_Position = pMatU * vMatU * mMatU * vec4(vPosA, 1.0);

  // -- Lighting -- //

  // Ambient components we'll leave until frag shader
  colorV = vColA;
  textureV = textureA;

  // Diffuse component
  vec3 lightNorm = normalize(lModel.xyz - vModel.xyz);

  vec3 vertNorm = normalize((nMatU * vec4(vNormA,1.0)).xyz);
  diffuseV = dot(vertNorm, lightNorm);
  if (diffuseV < 0.0) { diffuseV = 0.0; }
       
  // Specular
    vec3 reflection = (vertNorm * diffuseV *
		 2.0) - lightNorm;
    vec3 viewer = vec3(0.,0.,0.);
    specularV = dot(normalize(reflection), 
                    normalize(viewer - vModel.xyz));
    if (specularV <= 0. || diffuseV <= 0.) { specularV = 0.0; }
    specularV = specularV * specularV;
    specularV = specularV * specularV;
    specularV = specularV * specularV;
    specularV = specularV * specularV;
}
    </script>
    <script id="vertex-shader-bad" type="x-shader/x-vertex">

// Vector Attributes
attribute vec3 vPosA;
attribute vec3 vNormA;
attribute vec3 vColA;
attribute vec2 textureA;

// Matrixes
uniform mat4 pMatU; // Position
uniform mat4 mMatU; // Model
uniform mat4 vMatU; // View
uniform mat3 nMatU; // Normal

// Position attributes
uniform vec3 lightPosU;
uniform vec3 viewPosU;

// Passed to the fragment shader
varying float diffuseV;
varying float specularV;
varying vec3 colorV;
varying vec2 textureV;

void main(void) {

  vec3 lightNorm = normalize(lightPosU);
  // -- Position -- //

  gl_Position = pMatU * vMatU * mMatU * vec4(vPosA, 1.0);

  // -- Lighting -- //

  // Ambient component we'll leave until frag shader
 
  colorV = vColA;
  textureV = textureA;

  vec3 n = nMatU * vNormA;

  // Diffuse component
  diffuseV = dot(n, lightNorm);
  if (diffuseV < 0.0) { diffuseV = 0.0; }
       
  // Specular
    vec3 reflection = (n * diffuseV *
		 2.0) - lightNorm;
    vec4 reflectNorm = vec4(normalize(reflection), 0.0);
    specularV = dot(reflectNorm, vec4(0,0,1,1) * vMatU);
    if (specularV <= 0. || diffuseV <= 0.) { specularV = 0.0; }
    specularV = specularV * specularV;
    specularV = specularV * specularV;
    specularV = specularV * specularV;
    specularV = specularV * specularV;
}
    </script>
    <script id="vertex-shader-bad" type="x-shader/x-vertex">

// Vector Attributes
attribute vec3 vPosA;
attribute vec3 vNormA;
attribute vec3 vColA;
attribute vec2 textureA;

// Matrixes
uniform mat4 pMatU; // Position
uniform mat4 mMatU; // Model
uniform mat4 vMatU; // View
uniform mat3 nMatU; // Normal

// Position attributes
uniform vec3 lightPosU;
uniform vec3 viewPosU;

// Passed to the fragment shader
varying float diffuseV;
varying float specularV;
varying vec3 colorV;
varying vec2 textureV;

void main(void) {

  vec3 lightNorm = normalize(lightPosU);
  // -- Position -- //

  gl_Position = pMatU * vMatU * mMatU * vec4(vPosA, 1.0);

  // -- Lighting -- //

  // Ambient component we'll leave until frag shader
 
  colorV = vColA;
  textureV = textureA;

  vec3 n = nMatU * vNormA;

  // Diffuse component
  diffuseV = dot(n, lightNorm);
  if (diffuseV < 0.0) { diffuseV = 0.0; }
       
  // Specular
    vec3 reflection = (n * diffuseV *
		 2.0) - lightNorm;
    vec4 reflectNorm = vec4(normalize(reflection), 0.0);
    specularV = dot(reflectNorm, vec4(0,0,1,1) * vMatU);
    if (specularV <= 0. || diffuseV <= 0.) { specularV = 0.0; }
    specularV = specularV * specularV;
    specularV = specularV * specularV;
    specularV = specularV * specularV;
    specularV = specularV * specularV;
}
    </script>
  </head>

  <body onload="theCanvas = new GLcanvas();">
    <div id='wrap'>
      <div id='header'>
        <div class='one_third'>
          <input type="button" 
		 onclick="expand('title2', 'content2')" 
		 value="WebGL:" 
		 class="button_add" />
	</div>
        <div class='one_third'>A</div>
        <div class='one_third'>Demo</div>
      </div>

      <script type="text/javascript">
        function expand() {
	document.getElementById("header").style.display = "none";
	document.getElementById("footer").style.display = "none";
        var id_ = document.getElementById(arguments[1]);
        var notOpen_ = (id_.style.display !== "inline-block");
        if (notOpen_ == true) {
        var cont_ = document.getElementById(arguments[0]);
        id_.style.display = 'inline-block';
        cont_.style.color = '#555577';
	} else {
        id_.style.display = 'none';
        var cont_ = document.getElementById(arguments[0]);
        cont_.style.width = '90%';
        cont_.style.color = '#111144';
        }
        }
      </script>

      <div class='padDiv'> 
	<div id = "banner">       
	  <div class="lowAcross" ></div>
          <div class="topAcross" ></div>
          <div class="leftSide" ></div>
          <div class="rightSide" ></div>
          <div class="topLeft" ></div>
          <div class="topRight" ></div>
	  <div class="lowLeft" ></div>
          <div class="lowRight" ></div>
	  <div id="dashboard" style="padding: 20px; background-color: #000000;">
	    <div id="positionXStats" style="display:none;"></div>
	    <div id="positionYStats" style="display:none;"></div>
	    <div id="rotateStats" style="display:none;"></div>
	    <div id="rotateCamStats" style="display:none;"></div>
	    <div id="priveledgedStats" style="display:none;"></div>
	    <div id="positionCheckStats" style="display:none;"></div>
	  </div>
	</div>

	  <div id="keyboard" style="position:absolute; bottom: 0px; left: 0px; color: #ffffff;"></div>
        <div class='main'>
          <div class="border lowAcross" ></div>
          <div class="border topAcross" ></div>
          <div class="border leftSide" ></div>
          <div class="border rightSide" ></div>
          <div class="border topLeft" ></div>
          <div class="border topRight" ></div>
	  <div class="border lowLeft" ></div>
          <div class="border lowRight" ></div>
            <canvas id="glcanvas" width="1100" height="800" style="position: absolute 0px 0px; background-color:red; display:none;">
			Your browser doesn't appear to support the HTML5 
			<code>&lt;canvas&gt;</code> element.
	    </canvas>
          <div class="title" id="title2">            
            <input type="button" 
		   onclick="expand('title2', 'webgl_object'); theCanvas.start('cylinder');" 
		   value="Cylinder" 
		   class="button_add" 
		   style="width:15%;"/>
            <input type="button" 
		   onclick="expand('title2', 'webgl_object'); theCanvas.start('sphere');" 
		   value="Sphere" 
		   class="button_add"
		   style="width:15%;"/>
            <input type="button" 
		   onclick="expand('title2', 'webgl_object'); theCanvas.start('skybox');" 
		   value="Skybox" 
		   class="button_add"
		   style="width:15%;"/>
            <input type="button" 
		   onclick="expand('title2', 'webgl_object'); theCanvas.start('torus');" 
		   value="Torus" 
		   class="button_add"
		   style="width:15%;"/>
            <input type="button" 
		   onclick="expand('title2', 'webgl_object'); theCanvas.start('stool');" 
		   value="Stool" 
		   class="button_add"
		   style="width:15%;"/>
            <input type="button" 
		   onclick="expand('title2', 'webgl_object'); theCanvas.start('maze');" 
		   value="Maze" 
		   class="button_add"
		   style="width:15%;"/>
          </div>
          <div id="webgl_object" class="content">
<!--            <canvas id="glcanvas" style="width:400px; height:400px">
			Your browser doesn't appear to support the HTML5 
			<code>&lt;canvas&gt;</code> element.
	    </canvas>-->
	    <input type="button"
		   onclick="expand('title2', 'settings')" 
		   value="Change settings!" 
		   class="button_add" />
          </div>       
		  
          <div id="settings" class="content">
              Privledge Mode:<br/>
              <input type="button" onclick="priveledgedMode.toggle()" value="toggle"/>
              <br/>Debug Statistics:<br/>
              <input type="button" 
		     onclick="mazeDebug = !mazeDebug;" 
		     value="Maze Bound Checking"/>
	      <br/><br/>
              Move scene:<br/>
              <input type="button" onclick="positionY.setInc(-1)" value="Up"/>
              <input type="button" onclick="positionY.setInc(1)" value="Down"/>
              <input type="button" onclick="positionX.setInc(-1)" value="Left"/>
              <input type="button" onclick="positionX.setInc(1)" value="Right"/>
	      <br/><br/>
              Rotate camera once every:<br/>
              <input type="button" onclick="rotateCam.setInc(6)" value="second"/>
              <input type="button" onclick="rotateCam.setInc(3)" value="2 seconds"/>
              <input type="button" onclick="rotateCam.setInc(2)" value="3 seconds"/>
              <input type="button" onclick="rotateCam.setInc(1.5)" value="4 seconds"/>
              <input type="button" onclick="rotateCam.setInc(1.2)" value="5 seconds"/>
	      <br/>
              <input type="button" onclick="rotateCam.pause()" value="||"/>
              <br/>Rotate viewing frame once every:<br/>
              <input type="button" onclick="rotateY.setInc(6)" value="second"/>
              <input type="button" onclick="rotateY.setInc(3)" value="2 seconds"/>
              <input type="button" onclick="rotateY.setInc(2)" value="3 seconds"/>
              <input type="button" onclick="rotateY.setInc(1.5)" value="4 seconds"/>
              <input type="button" onclick="rotateY.setInc(1.2)" value="5 seconds"/>
	      <br/>
              <input type="button" onclick="rotateY.pause()" value="||"/>
              <br/><br/>Zoom:<br/>
              <input type="button" onclick="zoom.setIncZoom(-1)" value="in"/>
              <input type="button" onclick="zoom.setIncZoom(1)" value="out"/>
              <input type="button" onclick="zoom.pause()" value="||"/>
              <br/><br/>Adjust Stool Height:<br/>
              <input type="button" onclick="stoolHeight.setStoolHeight(0.1)" value="up"/>
              <input type="button" onclick="stoolHeight.setStoolHeight(-0.1)" value="down"/>
              <br/><br/>Pause:<br/>
              <input type="button" onclick="pause.toggle()" value="||"/>
              <br/><br/>Select Shading:<br/>
              <input type="button" value="ADS model"
onclick="theCanvas.changeShaders('shader-fs', 'shader-vs')"/>
              <input type="button" value="Flat shading" 
onclick="theCanvas.changeShaders(shader-fs', 'vertex-shader-flat')"/>
              <input type="button" value="Bad shading" 
onclick="theCanvas.changeShaders('frag-shader-flat', 'vertex-shader-bad')"/>
              <input type="button" value="Worse shading" 
onclick="theCanvas.changeShaders('shader-fs', 'vertex-shader-bad')"/>
              <br/><br/>Reset Model:<br/>
              <input type="button" value="Do Not Press" onclick="resetModel()"/>

          </div>        
	</div>
      </div>
    </div>
      
    <div id="footer"> 
      <input type="button" 
	     onclick="expand('title4', 'content4')" 
	     value="(c) 2013 Batman and Robin" 
	     class="button_add" />
      <div id="content4" class="content">
	A noob
	
      </div>
      <div class="title" id="title4" > </div>            
      
    </div>
    
</div>
</body>
</html>
