 /*
  Vertex Shader generico
    @attribute posicion : vec4 coordenadas del vertice
    @attribute color : vec4 color del vertice
    @uniform modelMatrix : mat4 matriz del modelo
    @uniform viewMatrix : mat4 matriz de la vista
    @uniform projMatrix : mat4 matriz de normalizacion
  rvivo@upv.es 2014
 */

 //declarations
 attribute vec4 posicion;
 attribute vec4 color;
 uniform mat4 modelMatrix;
 uniform mat4 viewMatrix;
 uniform mat4 projMatrix;

 varying highp vec4 vColor;

 void main(void) {
    gl_Position = projMatrix * viewMatrix * modelMatrix * posicion;
    vColor = color;
 }