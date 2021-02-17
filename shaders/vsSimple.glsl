 /* Generic vertex shader */

 //declarations
 attribute vec3 aVertexPosition;
 attribute vec3 aVertexColor;

 varying highp vec4 vColor;

 void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0);
    vColor = vec4(aVertexColor, 1.0);
 }