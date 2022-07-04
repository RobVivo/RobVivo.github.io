/**
  test.js
  Ejemplo Three.js_r140: Cubo RGB con iluminacion y textura

  Cubo con color por vertice y mapa de uvs usando la clase BufferGeometry.
  La textura es una unica imagen en forma de cubo desplegado en cruz horizontal.
  Cada cara se textura segun mapa uv en la textura.
  En sentido antihorario las caras son:
    Delante:   7,0,3,4
    Derecha:   0,1,2,3
    Detras:    1,6,5,2
    Izquierda: 6,7,4,5
    Arriba:    3,2,5,4
    Abajo:     0,7,6,1
  Donde se han numerado de 0..7 los vertices del cubo.
  Los atributos deben darse por vertice asi que necesitamos 8x3=24 vertices pues
  cada vertice tiene 3 atributos de normal, color y uv al ser compartido por 3 caras. 

  @author rvivo@upv.es (c) Libre para fines docentes
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
  camera.lookAt(0,0,0);

  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.target.set( 0, 0, 0 );

  window.addEventListener('resize', updateAspectRatio );
}

function loadCubo(lado)
{
  // Instancia el objeto BufferGeometry
	var malla = new THREE.BufferGeometry();
  // Construye la lista de coordenadas y colores por vertice
  var semilado = lado/2.0;
  var coordenadas = [ // 6caras x 4vert x3coor = 72float
                // Front 
                -semilado,-semilado, semilado, // 7 -> 0
                semilado,-semilado, semilado,  // 0 -> 1
                semilado, semilado, semilado,  // 3 -> 2
                -semilado, semilado, semilado, // 4 -> 3
                // Right
                semilado,-semilado, semilado,  // 0 -> 4
                semilado,-semilado,-semilado,  // 1 -> 5
                semilado, semilado,-semilado,  // 2 -> 6
                semilado, semilado, semilado,  // 3 -> 7
                // Back
                semilado,-semilado,-semilado,  // 1 -> 8
                -semilado,-semilado,-semilado, // 6 -> 9
                -semilado, semilado,-semilado, // 5 ->10
                semilado, semilado,-semilado,  // 2 ->11
                // Left
                -semilado,-semilado,-semilado, // 6 ->12
                -semilado,-semilado, semilado, // 7 ->13
                -semilado, semilado, semilado, // 4 ->14
                -semilado, semilado,-semilado, // 5 ->15
                // Top
                semilado, semilado, semilado,  // 3 ->16
                semilado, semilado,-semilado,  // 2 ->17
                -semilado, semilado,-semilado, // 5 ->18
                -semilado, semilado, semilado, // 4 ->19
                // Bottom
                semilado,-semilado, semilado,  // 0 ->20
                -semilado,-semilado, semilado, // 7 ->21 
                -semilado,-semilado,-semilado, // 6 ->22
                semilado,-semilado,-semilado   // 1 ->23
  ]
  var colores = [ // 24 x3
                0,0,0,   // 7
                1,0,0,   // 0
                1,1,0,   // 3
                0,1,0,   // 4

                1,0,0,   // 0
                1,0,1,   // 1
                1,1,1,   // 2
                1,1,0,   // 3

                1,0,1,   // 1
                0,0,1,   // 6
                0,1,1,   // 5
                1,1,1,   // 2

                0,0,1,   // 6
                0,0,0,   // 7
                0,1,0,   // 4
                0,1,1,   // 5

                1,1,0,   // 3
                1,1,1,   // 2
                0,1,1,   // 5
                0,1,0,   // 4

                1,0,0,   // 0
                0,0,0,   // 7
                0,0,1,   // 6
                1,0,1    // 1
  ]
  var normales = [ // 24 x3
                0,0,1, 0,0,1, 0,0,1, 0,0,1,      // Front
                1,0,0, 1,0,0, 1,0,0, 1,0,0,      // Right
                0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,  // Back 
                -1,0,0, -1,0,0, -1,0,0, -1,0,0,  // Left
                0,1,0, 0,1,0, 0,1,0, 0,1,0,      // Top 
                0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0   // Bottom
                ];
  var uvs = [  // 24 x2
               // Front
                0/4,1/3 , 1/4,1/3 , 1/4,2/3 , 0/4,2/3 , // 7,0,3,4
                1/4,1/3 , 2/4,1/3 , 2/4,2/3 , 1/4,2/3 , // 0,1,2,3
                2/4,1/3 , 3/4,1/3 , 3/4,2/3 , 2/4,2/3 , // 1,6,5,2
                3/4,1/3 , 4/4,1/3 , 4/4,2/3 , 3/4,2/3 , // 6,7,4,5
                1/4,2/3 , 2/4,2/3 , 2/4,3/3 , 1/4,3/3 , // 3,2,5,4
                1/4,1/3 , 1/4,0/3 , 2/4,0/3 , 2/4,1/3   // 0,7,6,1
            ];
  var indices = [ // 6caras x 2triangulos x3vertices = 36
              0,1,2,    2,3,0,    // Front
              4,5,6,    6,7,4,    // Right 
              8,9,10,   10,11,8,  // Back
              12,13,14, 14,15,12, // Left
              16,17,18, 18,19,16, // Top
              20,21,22, 22,23,20  // Bottom
                 ];

  scene.add( new THREE.DirectionalLight() );

  // Geometria por att arrays en r140
  malla.setIndex( indices );
  malla.setAttribute( 'position', new THREE.Float32BufferAttribute(coordenadas,3));
  malla.setAttribute( 'normal', new THREE.Float32BufferAttribute(normales,3));
  malla.setAttribute( 'color', new THREE.Float32BufferAttribute(colores,3));
  malla.setAttribute( 'uv', new THREE.Float32BufferAttribute(uvs,2));

  // Configura un material
  var textura = new THREE.TextureLoader().load( 'images/ilovecg.png' );
  var material = new THREE.MeshLambertMaterial( { vertexColors: true, map: textura, side: THREE.DoubleSide } );

  // Construye el objeto grafico 
  console.log(malla);   //-> Puedes consultar la estructura del objeto
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
  cubo.rotation.y += angulo;
  cubo.rotation.x += angulo/2;
}

function render()
{
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}