function initShaders()
{
	//get shader source
	var fs_source = document.getElementById('shader-fs').innerHTML,
		vs_source = document.getElementById('shader-vs').innerHTML;
	//compile shaders
	vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
	fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);
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