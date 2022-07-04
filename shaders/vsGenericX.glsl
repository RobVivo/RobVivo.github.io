vs_source = "attribute vec3 vertexPosition; attribute vec3 vertexColor;varying highp vec4 vColor;void main(void) {gl_Position = vec4(vertexPosition, 1.0);vColor = vec4(vertexColor, 1.0);}";
 