/**
  @file  test.js
  @brief Ejemplo Three.js: Cubo RGB con textura

  Cubo con color por vertice y mapa de uvs usando la clase Geometry.
  La textura es una unica imagen en forma de cubo desplegado en cruz horizontal.
  Cada cara se textura segun mapa uv en la textura.
  En sentido antihorario las caras son:
    Delante:   7,0,3,4
    Derecha:   0,1,2,3
    Detras:    1,6,5,2
    Izquierda: 6,7,4,5
    Arriba:    4,3,2,5
    Abajo:     7,6,1,0 

  @author rvivo@upv.es
*/

var renderer, scene, camera, cubo;
var cameraControls;
var angulo = -0.01;

init();
loadCubo(1.0);
render();

function init()
{
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( new THREE.Color(0xFFFFFF) );
  document.getElementById('container').appendChild( renderer.domElement );

  scene = new THREE.Scene();

  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera( 50, aspectRatio , 0.1, 100 );
  camera.position.set( 1, 1.5, 2 );

  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.target.set( 0, 0, 0 );

  window.addEventListener('resize', updateAspectRatio );
}

function loadCubo(lado)
{
  // Instancia el objeto Geometry
	var malla = new THREE.Geometry();
  // Construye la lista de coordenadas y colores por vertice (8)
  var semilado = lado/2.0;
  var coordenadas = [    
                 semilado,-semilado, semilado,  // 0
                 semilado,-semilado,-semilado,  // 1
                 semilado, semilado,-semilado,  // 2
                 semilado, semilado, semilado,  // 3
                -semilado, semilado, semilado,  // 4
                -semilado, semilado,-semilado,  // 5
                -semilado,-semilado,-semilado,  // 6
                -semilado,-semilado, semilado   // 7 
                ];
  var colores =     [ 
                0xFF0000,   // 0
                0xFF00FF,   // 1
                0xFFFFFF,   // 2
                0xFFFF00,   // 3
                0x00FF00,   // 4
                0x00FFFF,   // 5
                0x0000FF,   // 6
                0x000000    // 7
                 ];
  // Indica como enlazar los vertices para formar triangulos (12)
  var indices = [
                7,0,3, 7,3,4, // Front
                0,1,2, 0,2,3, // Right 
                1,6,5, 1,5,2, // Back
                6,7,4, 6,4,5, // Left
                4,3,2, 4,2,5, // Top
                0,7,6, 0,6,1  // Bottom
                   ];
  var normales = [
                0,0,1, 0,0,1,   // Front
                1,0,0, 1,0,0,   // Right
                0,0,-1, 0,0,-1, // Back 
                -1,0,0, -1,0,0, // Left
                0,1,0, 0,1,0,   // Top 
                0,-1,0, 0,-1,0  // Bottom
                ];
  var uvs = [  new THREE.Vector2( 1/4,1/3 ), new THREE.Vector2( 2/4,1/3 ), new THREE.Vector2( 2/4,2/3 ) , // 7,0,3
               new THREE.Vector2( 1/4,1/3 ), new THREE.Vector2( 2/4,2/3 ), new THREE.Vector2( 1/4,2/3 ) , // 7,3,4
               new THREE.Vector2( 2/4,1/3 ), new THREE.Vector2( 3/4,1/3 ), new THREE.Vector2( 3/4,2/3 ) , // 0,1,2
               new THREE.Vector2( 2/4,1/3 ), new THREE.Vector2( 3/4,2/3 ), new THREE.Vector2( 2/4,2/3 ) , // 0,2,3
               new THREE.Vector2( 3/4,1/3 ), new THREE.Vector2( 4/4,1/3 ), new THREE.Vector2( 4/4,2/3 ) , // 1,6,5
               new THREE.Vector2( 3/4,1/3 ), new THREE.Vector2( 4/4,2/3 ), new THREE.Vector2( 3/4,2/3 ) , // 1,5,2
               new THREE.Vector2( 0/4,1/3 ), new THREE.Vector2( 1/4,1/3 ), new THREE.Vector2( 1/4,2/3 ) , // 6,7,4
               new THREE.Vector2( 0/4,1/3 ), new THREE.Vector2( 1/4,2/3 ), new THREE.Vector2( 0/4,2/3 ) , // 6,4,5
               new THREE.Vector2( 1/4,2/3 ), new THREE.Vector2( 2/4,2/3 ), new THREE.Vector2( 2/4,3/3 ) , // 4,3,2
               new THREE.Vector2( 1/4,2/3 ), new THREE.Vector2( 2/4,3/3 ), new THREE.Vector2( 1/4,3/3 ) , // 4,2,5
               new THREE.Vector2( 2/4,1/3 ), new THREE.Vector2( 1/4,1/3 ), new THREE.Vector2( 1/4,0/3 ) , // 0,7,6
               new THREE.Vector2( 2/4,1/3 ), new THREE.Vector2( 1/4,0/3 ), new THREE.Vector2( 2/4,0/3 ) , // 0,6,1
            ];


  // Construye vertices y los inserta en la malla
  for(var i=0; i<coordenadas.length; i+=3) {
    var vertice = new THREE.Vector3( coordenadas[i], coordenadas[i+1], coordenadas[i+2] );
    malla.vertices.push( vertice );
  }

  // Construye caras y las inserta en la malla
  for(var i=0; i<indices.length; i+=3){
    // Formar la cara
    var triangulo = new THREE.Face3( indices[i], indices[i+1], indices[i+2] );
    // Indicar la normal por vertice
    triangulo.normal = new THREE.Vector3( normales[i], normales[i+1], normales[i+2] );
    // Indicar el color por vertice
    for(var j=0; j<3; j++){
      // Cada vertice de cada triangulo tiene su propio color
      var color = new THREE.Color( colores[ indices[i+j] ] );
      triangulo.vertexColors.push( color );
    }
    // Añadir a la lista de caras
    malla.faces.push( triangulo );
    // Añadir las coordenadas de textura por vertice de la cara añadida
    malla.faceVertexUvs[0].push( [ uvs[i] , uvs[i+1], uvs[i+2] ] );
  }

  // Configura un material
  var textura = new THREE.ImageUtils.loadTexture( 'images/ilovecg.png' );
  var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors, map: textura, side: THREE.DoubleSide } );

  // Construye el objeto grafico 
  cubo = new THREE.Mesh( malla, material );

	// Añade el objeto grafico a la escena
	scene.add( cubo );
}

function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function update()
{
  // Cambios para actualizar la camara segun mvto del raton
  cameraControls.update();

  // Movimiento propio del cubo
	cubo.rotateOnAxis( new THREE.Vector3(0,1,0), angulo );
}

function render()
{
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}