// AETHER — Thin-Film Interference Shader
// Adapted from MelodicBloom/shader-gallery
// Models soap-bubble / oil-slick colour via wavelength interference.

uniform float uThickness;
uniform float uSpeed;

vec3 wavelengthToRGB(float lambda) {
  float t;
  vec3 col = vec3(0.0);
  if (lambda >= 380.0 && lambda < 440.0) {
    t = (440.0 - lambda) / 60.0;
    col = vec3(t, 0.0, 1.0);
  } else if (lambda < 490.0) {
    t = (lambda - 440.0) / 50.0;
    col = vec3(0.0, t, 1.0);
  } else if (lambda < 510.0) {
    t = (510.0 - lambda) / 20.0;
    col = vec3(0.0, 1.0, t);
  } else if (lambda < 580.0) {
    t = (lambda - 510.0) / 70.0;
    col = vec3(t, 1.0, 0.0);
  } else if (lambda < 645.0) {
    t = (645.0 - lambda) / 65.0;
    col = vec3(1.0, t, 0.0);
  } else if (lambda <= 780.0) {
    col = vec3(1.0, 0.0, 0.0);
  }
  float factor;
  if (lambda < 420.0)      factor = 0.3 + 0.7 * (lambda - 380.0) / 40.0;
  else if (lambda > 700.0) factor = 0.3 + 0.7 * (780.0 - lambda) / 80.0;
  else                     factor = 1.0;
  return col * factor;
}

float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash2(i), hash2(i + vec2(1.0, 0.0)), f.x),
    mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

vec3 renderIridescence(vec2 uv, float time) {
  float flow = time * uSpeed;
  float thickNoise = noise2(uv * 3.0 + vec2(flow * 0.4, flow * 0.25));
  float d = uThickness + thickNoise * 200.0 - 100.0;
  vec3 col = vec3(0.0);
  float nSamples = 6.0;
  for (float i = 0.0; i < nSamples; i++) {
    float lambda = 380.0 + (780.0 - 380.0) * (i / (nSamples - 1.0));
    float phase = 2.0 * d / lambda;
    float intensity = 0.5 + 0.5 * cos(6.28318 * phase);
    col += wavelengthToRGB(lambda) * intensity;
  }
  col /= nSamples * 0.5;
  float vig = 1.0 - dot(uv - 0.5, (uv - 0.5) * 1.8);
  col *= clamp(vig, 0.0, 1.0);
  col = mix(vec3(0.01, 0.02, 0.04), col, 0.9);
  return clamp(col, 0.0, 1.0);
}
