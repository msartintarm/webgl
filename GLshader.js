

function GLshader() {
    this.fragment = [];
    this.vertex = [];

    this.f_decls = "\
precision mediump float;\n\
\n\
uniform float ambient_coeff_u;\n\
uniform float diffuse_coeff_u;\n\
uniform float specular_coeff_u;\n\
uniform vec3 specular_color_u;\n\
\n\
varying float diffuseV;\n\
varying float specularV;\n\
varying vec3 colorV;\n\
\n\
uniform vec2 gaussFilter[7];\n\
uniform float ballHitu;\n\
uniform vec2 u_Scale;\n\
\n\
varying vec3 reflectionV;\n\
varying vec3 viewPosV;\n\
varying vec3 vModel;\n\
varying vec4 lModel;\n\
varying vec3 lightNorm;\n\
varying vec3 vertNorm;\n\
\n\
varying vec2 textureV;\n\
varying vec2 shadowV;\n\
\n\
uniform float textureNumU;\n\
\n\
uniform float u_kernel[9];\n\
uniform vec2 u_textureSize;\n\
\n\
uniform sampler2D sampler0;\n\
uniform sampler2D sampler1;\n\
uniform sampler2D sampler2;\n\
uniform sampler2D sampler3;\n\
uniform sampler2D sampler4;\n\
uniform sampler2D sampler5;\n\
uniform sampler2D sampler6;\n\
uniform sampler2D sampler7;\n\
uniform sampler2D sampler8;\n\
uniform sampler2D sampler9;\n\
uniform sampler2D sampler10;\n\
\n\
//Specular function\n\
float specular() {\n\
    vec3 reflectionV2 = (normalize(vertNorm) * diffuseV *\n\
		 2.0) - lightNorm;\n\
    vec3 viewer = vec3(0.,0.,0.);\n\
float specularV2 = dot(normalize(reflectionV2), \n\
                    normalize(viewer - vModel.xyz));\n\
    if (specularV2 <= 0. || diffuseV <= 0.) { specularV2 = 0.0; }\n\
    specularV2 = specularV2 * specularV2;\n\
    specularV2 = specularV2 * specularV2;\n\
    specularV2 = specularV2 * specularV2;\n\
    specularV2 = specularV2 * specularV2;\n\
    return specularV2;\n\
}\n\
";

    this.v_decls = "\n\
precision mediump float;  \n\
\n\
// Vector Attributes      \n\
attribute vec3 vPosA;\n\
attribute vec3 vNormA;\n\
attribute vec3 vColA;\n\
attribute vec2 textureA;\n\
\n\
// Matrixes\n\
uniform mat4 pMatU; // Position\n\
uniform mat4 mMatU; // Model\n\
uniform mat4 vMatU; // View\n\
uniform mat4 nMatU; // Normal\n\
uniform mat4 lMatU; // Lighting\n\
\n\
// Position attributes\n\
uniform vec3 lightPosU;\n\
uniform vec3 viewPosU;\n\
\n\
// Passed to the fragment shader\n\
varying float diffuseV;\n\
varying vec3 colorV;\n\
varying vec2 textureV;\n\
varying vec2 shadowV;\n\
\n\
varying vec3 viewPosV;\n\
varying vec3 vModel;\n\
varying vec4 lModel;\n\
varying vec3 lightNorm;\n\
varying vec3 vertNorm;\n\
";

    this.fragment["color"] = "\
void colorize() {\n\
  vec3 ambColor = colorV / 3.0 * ambient_coeff_u;\n\
  vec3 diffColor = colorV / 3.0 * diffuseV * diffuse_coeff_u;\n\
  vec3 specColor = specular_color_u * specular();\n\
  gl_FragColor = vec4(ambColor + diffColor + specColor, 1.0);\n\
}\n\
\n\
void main(void) {\n\
  colorize();\n\
}\n\
";

    this.fragment["default"] = "\
void colorize() {\n\
  vec3 ambColor = colorV / 3.0 * ambient_coeff_u;\n\
  vec3 diffColor = colorV / 3.0 * diffuseV * diffuse_coeff_u;\n\
  vec3 specColor = specular_color_u * specular();\n\
  gl_FragColor = vec4(ambColor + diffColor + specColor, 1.0);\n\
}\n\
\n\
void colorTexture(sampler2D theSampler) {\n\
  vec3 textureColor = texture2D(theSampler, vec2(textureV.s, textureV.t)).xyz;\n\
  vec3 ambColor = textureColor / 3.0 * ambient_coeff_u;\n\
  vec3 diffColor = textureColor * diffuseV * diffuse_coeff_u;\n\
  vec3 specColor = textureColor * specular();\n\
\n\
  gl_FragColor = vec4(ambColor + diffColor + specColor, 1.0);\n\
}\n\
\n\
void main(void) {\n\
\n\
  if (textureNumU < 0.1) { colorTexture(sampler0);\n\
  } else if (textureNumU < 1.1) { colorTexture(sampler1);\n\
  } else if (textureNumU < 2.1) { colorTexture(sampler2);\n\
  } else if (textureNumU < 3.1) { colorTexture(sampler3);\n\
  } else if (textureNumU < 4.1) { colorTexture(sampler4);\n\
  } else if (textureNumU < 5.1) { colorTexture(sampler5);\n\
  } else if (textureNumU < 6.1) { colorTexture(sampler6);\n\
  } else if (textureNumU < 7.1) { colorTexture(sampler7);\n\
  } else if (textureNumU < 8.1) { colorTexture(sampler8);\n\
  } else if (textureNumU < 9.1) { colorTexture(sampler9);\n\
  } else if (textureNumU < 10.1) { colorTexture(sampler10);\n\
  } else { colorize();\n\
  }\n\
}\n\
";

    this.fragment["frame"] = "\
void main(void) {\n\
\n\
  gl_FragColor = vec4(colorV, 1.0);\n\
}\n\
";

    this.fragment["ball"] = "\
vec4 getFilterEffect(sampler2D theSampler) {\n\
   vec2 onePixel = vec2(1.0,1.0)/ u_textureSize;\n\
   vec4 blurColor =\n\
       texture2D(theSampler, textureV + onePixel * vec2(-1, -1)) * u_kernel[0] +\n\
       texture2D(theSampler, textureV + onePixel * vec2( 0, -1)) * u_kernel[1] +\n\
       texture2D(theSampler, textureV + onePixel * vec2( 1, -1)) * u_kernel[2] +\n\
       texture2D(theSampler, textureV + onePixel * vec2(-1,  0)) * u_kernel[3] +\n\
       texture2D(theSampler, textureV + onePixel * vec2( 0,  0)) * u_kernel[4] +\n\
       texture2D(theSampler, textureV + onePixel * vec2( 1,  0)) * u_kernel[5] +\n\
       texture2D(theSampler, textureV + onePixel * vec2(-1,  1)) * u_kernel[6] +\n\
       texture2D(theSampler, textureV + onePixel * vec2( 0,  1)) * u_kernel[7] +\n\
       texture2D(theSampler, textureV + onePixel * vec2( 1,  1)) * u_kernel[8];\n\
   \n\
       float kernelWeight =\n\
          u_kernel[0] +\n\
          u_kernel[1] +\n\
          u_kernel[2] +\n\
          u_kernel[3] +\n\
          u_kernel[4] +\n\
          u_kernel[5] +\n\
          u_kernel[6] +\n\
          u_kernel[7] +\n\
          u_kernel[8] ;\n\
\n\
       if (kernelWeight <= 0.0) {\n\
          kernelWeight = 1.0;\n\
       }\n\
       return vec4((blurColor / kernelWeight).rgb, 1.0);\n\
}\n\
\n\
\n\
void colorize() {\n\
  vec3 ambColor = colorV / 3.0 * ambient_coeff_u;\n\
  vec3 diffColor = colorV / 3.0 * diffuseV * diffuse_coeff_u;\n\
  vec3 specColor = specular_color_u * specular();\n\
  gl_FragColor = vec4(ambColor + diffColor + specColor, 1.0);\n\
}\n\
\n\
void colorTexture(sampler2D theSampler) {\n\
  vec4 textureColor;\n\
  if(ballHitu == 1.0){\n\
 	textureColor = getFilterEffect(theSampler); \n\
 }\n\
  else{\n\
	textureColor.xyz = colorV.xyz;\n\
	textureColor.a = 0.635;\n\
  }\n\
  vec3 ambColor = textureColor.xyz / 3.0 * ambient_coeff_u;\n\
  vec3 diffColor = textureColor.xyz * diffuseV * diffuse_coeff_u;\n\
  vec3 specColor = textureColor.xyz * specular();\n\
\n\
  gl_FragColor = vec4(ambColor + diffColor + specColor, textureColor.a);\n\
}\n\
\n\
void main(void) {\n\
\n\
  if (textureNumU < 0.1) { colorTexture(sampler0);\n\
  } else if (textureNumU < 1.1) { colorTexture(sampler0);\n\
  } else { colorTexture(sampler0);\n\
  }\n\
}\n\
";

    this.vertex["color"] = "\
void main(void) {\n\
\n\
// Viewing space coordinates of light / vertex\n\
vModel = (vMatU * mMatU  * vec4(vPosA, 1.0)).xyz;\n\
lModel = vMatU * lMatU * vec4(lightPosU, 1.0);\n\
\n\
  // -- Position -- //\n\
\n\
  gl_Position = pMatU * vMatU * mMatU * vec4(vPosA, 1.0);\n\
\n\
  // -- Lighting -- //\n\
\n\
  // Ambient components we'll leave until frag shader\n\
  colorV = vColA;\n\
\n\
  // Diffuse component\n\
  lightNorm = normalize(lModel.xyz - vModel.xyz);\n\
\n\
  vertNorm = normalize((nMatU * vec4(vNormA,1.0)).xyz);\n\
  diffuseV = dot(vertNorm, lightNorm);\n\
  if (diffuseV < 0.0) { diffuseV = 0.0; }\n\
}       \n\
";

    this.vertex["default"] = "\
void main(void) {\n\
\n\
// Viewing space coordinates of light / vertex\n\
vModel = (vMatU * mMatU  * vec4(vPosA, 1.0)).xyz;\n\
lModel = vMatU * lMatU * vec4(lightPosU, 1.0);\n\
\n\
  // -- Position -- //\n\
\n\
  gl_Position = pMatU * vMatU * mMatU * vec4(vPosA, 1.0);\n\
\n\
  // -- Lighting -- //\n\
\n\
  // Ambient components we'll leave until frag shader\n\
  colorV = vColA;\n\
  textureV = textureA;\n\
\n\
  // Diffuse component\n\
  lightNorm = normalize(lModel.xyz - vModel.xyz);\n\
\n\
  vertNorm = normalize((nMatU * vec4(vNormA,1.0)).xyz);\n\
  diffuseV = dot(vertNorm, lightNorm);\n\
  if (diffuseV < 0.0) { diffuseV = 0.0; }\n\
}       \n\
";
}    


/*
 * http://dev.opera.com/articles/view/raw-webgl-part1-getting-started/
 */
GLshader.prototype.init = function(gl_, gl_shader, frag_name, vert_name) {

    var f_shader = gl_.createShader(gl_.FRAGMENT_SHADER);
    gl_.shaderSource(f_shader, "" + this.f_decls + this.fragment[frag_name]);
    gl_.compileShader(f_shader);

    var v_shader = gl_.createShader(gl_.VERTEX_SHADER);
    gl_.shaderSource(v_shader, "" + this.v_decls + this.vertex[vert_name]);
    gl_.compileShader(v_shader);

    gl_.attachShader(gl_shader, v_shader);
    gl_.attachShader(gl_shader, f_shader);

    // Firefox says macs behave poorly if 
    // an unused attribute is bound to index 0
    gl_.bindAttribLocation(gl_shader, 0, "vPosA");

    gl_.linkProgram(gl_shader);

    if (!gl_.getProgramParameter(gl_shader, gl_.LINK_STATUS)) {
	return -1;
    }

    return 0;
};

GLshader.prototype.cleanup = function() {
    this.fragment = null;
    this.vertex = null;

    this.f_decls = null;
    this.v_decls = null;
};

