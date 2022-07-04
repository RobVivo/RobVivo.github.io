 /*
  Fragment Shader con color uniform
  @uniform color : vec3 color del fragmento
  rvivo@upv.es 2014
 */

// Uniform
uniform highp vec3 color;

void main(void) {
    gl_FragColor = vec4( color, 1.0 );
}