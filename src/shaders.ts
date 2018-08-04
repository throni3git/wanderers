import {classic3DNoise} from "./noiseShader";

export const displacmentVertexShader = classic3DNoise + `
varying vec2 vUv;
varying float noise;
uniform float time;
varying vec3 vNormal;

float turbulence(vec3 p) {
  float w = 100.0;
  float t = -0.5;

  for (float f = 1.0; f <= 10.0; f++) {
    float power = pow(2.0, f);
    t += abs( pnoise(vec3(power * p), vec3(10.0)) / power);
  }
  return t;
}

void main() {
  vUv = uv;
  vNormal = normal;

  // get a turbulent 3d noise using the normal, normal to high frequency
  noise = turbulence( 0.5 * position + time );

  // get a 3d noise using the position, low frequency
  float b = 0.1 * pnoise( 2.0 * position + vec3( 2.0 * time), vec3(20.0));

  //compose noises
  float displacement = noise + b;
  // float displacement = noise;
  // float displacement = b;

  // move the position along the normal and transform it
  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

export const displacmentFragmentShader = `
varying vec2 vUv;
varying float noise;
varying vec3 vNormal;

void main() {
  // color is RGBA: u, v, 0, 1
  vec2 color = vUv * (1.0-2.0*noise);
  gl_FragColor = vec4(normalize(vNormal), 1.0);
}
`;

export const gridShader = `
precision mediump float;

uniform float vpw; // Width, in pixels
uniform float vph; // Height, in pixels

uniform vec2 offset; // e.g. [-0.023500000000000434 0.9794000000000017], currently the same as the x/y offset in the mvMatrix
uniform vec2 pitch;  // e.g. [50 50]

void main() {
  float lX = gl_FragCoord.x / vpw;
  float lY = gl_FragCoord.y / vph;

  float scaleFactor = 10000.0;

  float offX = (scaleFactor * offset[0]) + gl_FragCoord.x;
  float offY = (scaleFactor * offset[1]) + (1.0 - gl_FragCoord.y);

  if (int(mod(offX, pitch[0])) == 0 ||
      int(mod(offY, pitch[1])) == 0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5);
  } else {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
}
`;


