import type { UniformDef } from './types';

export const VERTEX_SHADER = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export function buildFragmentShader(body: string, uniforms: UniformDef[]): string {
  const uniformDecls = uniforms
    .map((u) => {
      switch (u.type) {
        case 'float': return `uniform float ${u.name};`;
        case 'vec2':  return `uniform vec2 ${u.name};`;
        case 'vec3':  return `uniform vec3 ${u.name};`;
        case 'vec4':  return `uniform vec4 ${u.name};`;
        case 'color': return `uniform vec3 ${u.name};`;
        default:      return `uniform float ${u.name};`;
      }
    })
    .join('\n  ');

  return `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
  ${uniformDecls}

${body}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec3 color = renderIridescence(uv, uTime);
  gl_FragColor = vec4(color, 1.0);
}
`;
}

export function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create shader object');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }
  return shader;
}

export function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error('Failed to create program object');
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${info}`);
  }
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  return program;
}

export function setUniform(
  gl: WebGLRenderingContext,
  location: WebGLUniformLocation | null,
  def: UniformDef,
  value: number | number[],
): void {
  if (!location) return;
  if (def.type === 'float') {
    gl.uniform1f(location, value as number);
  } else if (def.type === 'vec2') {
    const v = value as number[];
    gl.uniform2f(location, v[0], v[1]);
  } else if (def.type === 'vec3' || def.type === 'color') {
    const v = value as number[];
    gl.uniform3f(location, v[0], v[1], v[2]);
  } else if (def.type === 'vec4') {
    const v = value as number[];
    gl.uniform4f(location, v[0], v[1], v[2], v[3]);
  }
}
