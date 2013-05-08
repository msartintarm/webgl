function determine_error(the_error) {
    
    var error_element = document.getElementById("the_error");
    
    switch(the_error) {
    case 0:   //GL_INIT
	error_element.innerHTML = "Whoops - cannot create a scene."; break;
    default:  //SHADER_INIT 
	error_element.innerHTML = "Whoops - shader compilation failed."; break;
    }
}
