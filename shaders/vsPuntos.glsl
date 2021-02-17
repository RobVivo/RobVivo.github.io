/*
  Vertex Shader para puntos con tamaño de punto fijo
  @attribute posicion : vec3 coordenadas del vertice
  rvivo@upv.es 2014
 */

// Atributos
attribute vec3 posicion;

void main(void) {
    gl_Position = vec4( posicion, 1.0 );
    gl_PointSize = 10.0;
}