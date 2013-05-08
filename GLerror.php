<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN'
	  'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>
<!-- All text on this page is property of Aberger / Sartin-Tarm. (c) 2013. -->
<html xmlns='http://www.w3.org/1999/xhtml'>
  <head> 
    <title>WebGL Error</title> 
<<<<<<< HEAD
    <script type"text/javascript" src="GLerror.js"></script>
=======
    <script type"text/javascript">
      
      function determine_error(the_error) {

      var error_element = document.getElementById("error_description");

      switch(the_error) {
      case 0:   //GL_INIT
      error_element.innerHTML = "Whoops - cannot create a scene."; break;
      default:  //SHADER_INIT 
      error_element.innerHTML = "no"; break;
      }
      }
    </script>
>>>>>>> not sure what is here
  </head>
  
  <body style="color:#fedcba; background-color:#111111;" 
	onload="determine_error(0);" >
<<<<<<< HEAD
    <p id="the_error"></p>
=======
    <p id="error_description"></p>
>>>>>>> not sure what is here
    <p>Email 
      <a style="color:#abcdef;" href=craberger@gmail.com>Aberger</a> or 
      <a style="color:#abcdef;" href=msartintarm@gmail.com>Sartin-Tarm</a>
      if you think it's their fault.
    </p>
  </body>
</html>
