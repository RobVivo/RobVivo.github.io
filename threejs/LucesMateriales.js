/**
* LucesMateriales.js
* Carga un grafo de escena en Threejs con luces, sombras, texturas y video
*
*/

var renderer, scene, camera;

var angulo = 0;
var cuboEsfera;

var cameraControls;

// video
var video, videoImage, videoImageContext, videoTexture;

init();
loadScene();
render();

function init() {
	// Inicializar Threejs

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight);
	renderer.setClearColor( new THREE.Color(0x0000AA) );
	// Habilita el calculo de sombras
	renderer.shadowMap.enabled = true;
	document.getElementById('container').appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, 
		                     window.innerWidth/window.innerHeight,
							 0.1, 100 );
	camera.position.set( 0.5, 2, 5 );
	camera.lookAt( new THREE.Vector3(0,0,0) );

	cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
	cameraControls.target.set(0,0,0);

	// Capturar el evento de resize
	window.addEventListener('resize',updateAspectRatio);

	// Luces

	//- Ambiental
	var ambiental = new THREE.AmbientLight(0x222222);
	scene.add(ambiental);

	//- Puntual uniforme
	var puntual = new THREE.PointLight('white',0.3);
	puntual.position.set(0,5,0);
	scene.add(puntual);

	//- Direccional
	var direccional = new THREE.DirectionalLight('white',0.3);
	direccional.position.set(-2,3,8);
	scene.add(direccional);

	//- Focal
	var focal = new THREE.SpotLight('white',0.3);
	focal.position.set(2,4,-8);
	focal.angle = Math.PI/7
	focal.penumbra = 0.2;
	focal.target.position.set(0,0,-2);
	scene.add(focal.target);
	focal.castShadow = true;
	focal.shadow.camera.near = 2;
	focal.shadow.camera.far = 20;
	scene.add(new THREE.CameraHelper(focal.shadow.camera));
	scene.add(focal);

}

function loadScene()
{
	// Texturas
	var path = "images/";
	var txcubo = new THREE.TextureLoader().load(path+"wood512.jpg");
	var txsuelo = new THREE.TextureLoader().load(path+"r_256.jpg");
	txsuelo.repeat.set(2,2);
	txsuelo.wrapS = txsuelo.wrapT = THREE.MirroredRepeatWrapping;
	var txesfera = new THREE.TextureLoader().load(path+"Earth.jpg");
	var paredes = [ path + "posx.jpg", path + "negx.jpg",
	                path + "posy.jpg", path + "negy.jpg",
	                path + "posz.jpg", path + "negz.jpg"];
	var mapaEntorno = new THREE.CubeTextureLoader().load(paredes);

	// Materiales
	var mate = new THREE.MeshLambertMaterial({color:'red',map:txcubo});
	var pulido = new THREE.MeshPhongMaterial({color:'white',specular:0x1111FF,shininess:200,envMap:mapaEntorno});
	var matsuelo = new THREE.MeshLambertMaterial({color:'white',map:txsuelo});

	// Carga la escena
	var geoCubo = new THREE.BoxGeometry(2,2,2);
	var geoEsfera = new THREE.SphereGeometry( 0.8, 30, 30 );

	var cubo = new THREE.Mesh( geoCubo, mate );
	cubo.position.set( 1.5, 0, 0 );
	cubo.add( new THREE.AxesHelper( 1.5 ));
	cubo.receiveShadow = true;
	cubo.castShadow = true;

	var esfera = new THREE.Mesh( geoEsfera, pulido );
	esfera.position.set( -1, 0, 0 );
	esfera.receiveShadow = true;
	esfera.castShadow = true;

	cuboEsfera = new THREE.Object3D();
	cuboEsfera.add( cubo );
	cuboEsfera.add( esfera );
	cuboEsfera.position.y = 1.1;

	scene.add( cuboEsfera );
	
	scene.add( new THREE.AxesHelper(2) );

	// modelo externo
	var loader = new THREE.ObjectLoader();
	loader.load('models/spiderman2/spiderman-scene.json',
				function(obj){
					obj.position.set(0, 1, 0);
					cubo.add(obj);
				});

	// suelo
	var suelo = new THREE.Mesh( new THREE.PlaneGeometry(10,10,100,100), matsuelo );
	suelo.rotation.x = -Math.PI/2;
	suelo.receiveShadow = true;
	scene.add(suelo);

	// habitacion
	var shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = mapaEntorno;

	var matparedes = new THREE.ShaderMaterial({
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	});

	var habitacion = new THREE.Mesh( new THREE.BoxGeometry(30,30,30),matparedes);
	scene.add(habitacion);

	// Video como textura

	//-1. Crear el elemento de video 
	video = document.createElement('video');
	video.muted = "muted";
	video.src = 'videos/Pixar.mp4';
	video.load();
	video.play();
	//-2. Crear un canvas para el video
	videoImage = document.createElement('canvas');
	videoImage.width = 632;
	videoImage.height = 256;
	//-3. Obtener un contexto para dibujar
	videoImageContext = videoImage.getContext('2d');
	videoImageContext.fillStyle = '0x0000AA';
	videoImageContext.fillRect(0,0,videoImage.width,videoImage.height);
	//-4. Crear una textura a partir del canvas
	videoTexture = new THREE.Texture(videoImage);
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	//-5. Crear un material que tenga esa textura
	var movieMaterial = new THREE.MeshBasicMaterial({map:videoTexture,side:THREE.DoubleSide});
	//-6. Crear una pantalla
	var movieScreen = new THREE.Mesh( new THREE.PlaneGeometry(30,9,4,4), movieMaterial);
	movieScreen.position.set(0,10,-10);
	scene.add(movieScreen);
}

function updateAspectRatio()
{
	// Fija el tamaño del lienzo al nuevo tamaño de la ventana del cliente
	renderer.setSize(window.innerWidth,window.innerHeight);

	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();

}

function update()
{
	angulo += 0.01;
	cuboEsfera.rotation.y = angulo;

	// Cambiar la textura para cada frame del video
	if(video.readyState === video.HAVE_ENOUGH_DATA){
		videoImageContext.drawImage(video,0,0);
		if( videoTexture ) videoTexture.needsUpdate = true;
	}
}

function render()
{
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}