// AETHER — Abalone Nacre Shader
// Adapted from MelodicBloom/shader-gallery: abalone iridescence
// Simulates nacreous thin-film interference using FBM + spectral mapping.

uniform float uIridescence;
uniform float uScale;
uniform float uSpeed;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

vec3 spectrumNacre(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 a = vec3(0.05, 0.12, 0.18);
  vec3 b = vec3(0.20, 0.45, 0.55);
  vec3 c = vec3(0.65, 0.80, 0.90);
  vec3 d = vec3(0.80, 0.30, 0.60);
  if (t < 0.33)      return mix(a, b, t / 0.33);
  else if (t < 0.66) return mix(b, c, (t - 0.33) / 0.33);
  else               return mix(c, d, (t - 0.66) / 0.34);
}

vec3 renderIridescence(vec2 uv, float time) {
  vec2 p = uv * uScale;
  float t = time * uSpeed;
  float layer0 = fbm(p + vec2(t * 0.3, t * 0.17));
  float layer1 = fbm(p * 1.7 - vec2(t * 0.2, t * 0.25) + vec2(3.7, 2.1));
  float viewAngle = uv.y + 0.5 * (uv.x - 0.5);
  float interference = layer0 * 0.6 + layer1 * 0.4 + viewAngle * 0.3;
  interference = fract(interference * uIridescence);
  vec3 col = spectrumNacre(interference);
  float vignette = 1.0 - dot(uv - 0.5, (uv - 0.5) * 1.6);
  col *= clamp(vignette, 0.0, 1.0);
  col = mix(vec3(0.02, 0.04, 0.06), col, 0.92);
  return col;
}
