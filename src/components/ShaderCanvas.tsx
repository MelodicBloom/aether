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
    let running = false;
    let visible = false;
    let failed = false;
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let fragmentSource = '';
    let started = performance.now();

    const markFailed = (message: string) => {
      failed = true;
      canvas.dataset.shaderState = 'fallback';
      canvas.style.background = 'radial-gradient(circle at 35% 30%, rgba(126,231,255,.18), transparent 35%), radial-gradient(circle at 70% 65%, rgba(255,86,196,.14), transparent 42%), #080a10';
      console.warn(`[AETHER ShaderCanvas] ${message}`);
    };

    const destroy = () => {
      cancelAnimationFrame(frame);
      running = false;
      if (gl && program) gl.deleteProgram(program);
      program = null;
      gl = null;
      canvas.width = 1;
      canvas.height = 1;
    };

    const draw = () => {
      if (disposed || !running || !gl || !program) return;
      if (!document.hidden && visible) {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(2, Math.round(canvas.clientWidth * dpr));
        const height = Math.max(2, Math.round(canvas.clientHeight * dpr));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        gl.viewport(0, 0, width, height);
        const location = (name: string) => gl!.getUniformLocation(program!, name);
        gl.uniform1f(location('u_time'), (performance.now() - started) / 1000);
        gl.uniform2f(location('u_res'), width, height);
        gl.uniform1f(location('u_speed'), uniforms.speed);
        gl.uniform1f(location('u_intensity'), uniforms.intensity);
        gl.uniform1f(location('u_scale'), uniforms.scale);
        gl.uniform1f(location('u_family'), uniforms.family);
        gl.uniform1f(location('u_structure'), uniforms.structure);
        gl.uniform1f(location('u_spectral'), uniforms.spectral);
        gl.uniform1f(location('u_edge'), uniforms.edge);
        gl.uniform1f(location('u_flow'), uniforms.flow);
        gl.uniform1f(location('u_depth'), uniforms.depth);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (disposed || running || failed || !visible || !fragmentSource) return;
      try {
        gl = canvas.getContext('webgl', {
          alpha: false,
          antialias: false,
          depth: false,
          stencil: false,
          premultipliedAlpha: false,
          preserveDrawingBuffer: false,
          powerPreference: 'high-performance'
        });
        if (!gl) {
          markFailed('WebGL unavailable; showing static material fallback.');
          return;
        }

        program = gl.createProgram();
        if (!program) {
          markFailed('Unable to create WebGL program.');
          return;
        }
        gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexSource));
        gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentSource));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          const message = gl.getProgramInfoLog(program) ?? 'Program link failed';
          destroy();
          markFailed(message);
          return;
        }
        gl.useProgram(program);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        started = performance.now();
        running = true;
        canvas.dataset.shaderState = 'running';
        draw();
      } catch (error) {
        destroy();
        markFailed(error instanceof Error ? error.message : 'Shader compilation failed.');
      }
    };

    const onLost = (event: Event) => {
      event.preventDefault();
      failed = false;
      destroy();
    };
    const onRestored = () => start();
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else destroy();
    }, { rootMargin: '320px 0px', threshold: 0.01 });
    observer.observe(canvas);

    fetch(src, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${src}`);
        return response.text();
      })
      .then((source) => {
        fragmentSource = source;
        start();
      })
      .catch((error) => markFailed(error instanceof Error ? error.message : `Unable to load ${src}`));

    return () => {
      disposed = true;
      observer.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      destroy();
    };
  }, [src, uniforms.depth, uniforms.edge, uniforms.family, uniforms.flow, uniforms.intensity, uniforms.scale, uniforms.spectral, uniforms.speed, uniforms.structure]);

  return <canvas ref={canvasRef} className="shader-canvas" aria-label="Animated semantic material preview" />;
}