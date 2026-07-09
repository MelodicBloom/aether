// AETHER — Shell / Directional Iridescence Shader
// Layered structural colour with view-direction gradient shifts.
// Base shader for Fresnel and Holographic locked presets.

vec3 renderIridescence(vec2 uv, float time) {
  float angle = atan(uv.y - 0.5, uv.x - 0.5);
  float radius = length(uv - 0.5);
  float band  = sin(angle * 4.0 + time * 0.4 + radius * 6.0)  * 0.5 + 0.5;
  float band2 = sin(angle * 7.0 - time * 0.3 + radius * 10.0) * 0.5 + 0.5;
  vec3 base  = mix(vec3(0.05, 0.08, 0.20), vec3(0.80, 0.40, 0.90), band);
  vec3 layer = mix(vec3(0.20, 0.70, 0.80), vec3(0.90, 0.30, 0.50), band2);
  vec3 col = mix(base, layer, 0.5 + 0.5 * sin(radius * 8.0 - time * 0.5));
  float vig = 1.0 - dot(uv - 0.5, (uv - 0.5) * 2.0);
  col *= clamp(vig, 0.0, 1.0);
  col = mix(vec3(0.02, 0.02, 0.05), col, 0.88);
  return col;
}
