'use client';

import { useEffect, useRef } from 'react';
import type { UniformSpec } from '@/lib/types';

const vertexSource = `
attribute vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Unable to create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? 'Shader compilation failed';
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

export function ShaderCanvas({ src, uniforms }: { src: string; uniforms: UniformSpec }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let frame = 0;
    let disposed = false;

    const run = async () => {
      const fragmentSource = await fetch(src).then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${src}`);
        return response.text();
      });
      if (disposed) return;
      const gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'high-performance' });
      if (!gl) throw new Error('WebGL is unavailable');

      const program = gl.createProgram();
      if (!program) throw new Error('Unable to create WebGL program');
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'Program link failed');
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const locations = {
        time: gl.getUniformLocation(program, 'u_time'),
        resolution: gl.getUniformLocation(program, 'u_res'),
        speed: gl.getUniformLocation(program, 'u_speed'),
        intensity: gl.getUniformLocation(program, 'u_intensity'),
        scale: gl.getUniformLocation(program, 'u_scale'),
        family: gl.getUniformLocation(program, 'u_family'),
        structure: gl.getUniformLocation(program, 'u_structure'),
        spectral: gl.getUniformLocation(program, 'u_spectral'),
        edge: gl.getUniformLocation(program, 'u_edge')
      };
      const started = performance.now();

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
        const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        gl.viewport(0, 0, width, height);
      };

      const draw = () => {
        if (disposed) return;
        resize();
        gl.uniform1f(locations.time, (performance.now() - started) / 1000);
        gl.uniform2f(locations.resolution, canvas.width, canvas.height);
        gl.uniform1f(locations.speed, uniforms.speed);
        gl.uniform1f(locations.intensity, uniforms.intensity);
        gl.uniform1f(locations.scale, uniforms.scale);
        gl.uniform1f(locations.family, uniforms.family);
        gl.uniform1f(locations.structure, uniforms.structure);
        gl.uniform1f(locations.spectral, uniforms.spectral);
        gl.uniform1f(locations.edge, uniforms.edge);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        frame = requestAnimationFrame(draw);
      };
      draw();
    };

    run().catch((error) => console.error('[AETHER ShaderCanvas]', error));
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
    };
  }, [src, uniforms.edge, uniforms.family, uniforms.intensity, uniforms.scale, uniforms.spectral, uniforms.speed, uniforms.structure]);

  return <canvas ref={canvasRef} className="shader-canvas" aria-label="Animated shader preview" />;
}