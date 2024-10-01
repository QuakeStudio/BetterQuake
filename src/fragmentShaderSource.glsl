#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

in vec2 vUv;
out vec4 fragColor;
uniform sampler2D tDiffuse;
uniform float time;

uniform vec4 u_color;

void main() {
  fragColor = texture(tDiffuse, vUv) * u_color;
  fragColor.rg *= sin(time);
}