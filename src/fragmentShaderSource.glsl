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

// super simple fragment shader that can be used for debugging
// more of these but for testing textures or matrices and other stuff will be GREAT
// but i suppose fath11 cant bother to do it even tho he's the one that wrote this
// please yell at fath11 to make debugging easier if you think its too hard