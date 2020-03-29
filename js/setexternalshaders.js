/*
	Deben definirse las url's de los shaders antes de llamar al script
	vertex_shader_url = '...'
	fragment_shader_url = '...'
*/

//get shader sources with jQuery Ajax
var vs_source = jQuery.ajax({
				async: false,
				url: vertex_shader_url,
				dataType: 'xml'
	   			}).responseText;
var fs_source = jQuery.ajax({
				async: false,
				url: fragment_shader_url,
				dataType: 'xml'
	   			}).responseText;
function initShaders()
{
	//compile shaders
	var vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
	var fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);
	//create program
	glProgram = gl.createProgram();
	//attach and link shaders to the program
	gl.attachShader(glProgram, vertexShader);
	gl.attachShader(glProgram, fragmentShader);
	gl.linkProgram(glProgram);
	if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program.");
	}
	//use program
	gl.useProgram(glProgram);
}
function makeShader(src, type)
{
	//compile the vertex shader
	var shader = gl.createShader(type);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
	}
	return shader;
}