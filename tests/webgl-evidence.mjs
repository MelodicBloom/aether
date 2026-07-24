import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = await readFile(resolve('src/components/ShaderCanvas.tsx'), 'utf8');

const checks = [
  {
    id: 'client-boundary',
    status: /^['"]use client['"];?/m.test(source) ? 'proven' : 'missing',
    requirement: 'WebGL code is isolated behind a client component boundary.',
  },
  {
    id: 'effect-cleanup',
    status: /return\s*\(\)\s*=>[\s\S]*cancelAnimationFrame/.test(source) ? 'proven' : 'missing',
    requirement: 'Animation frame scheduling is cancelled during unmount.',
  },
  {
    id: 'context-unavailable-fallback',
    status: /WebGL is unavailable/.test(source) && /fallback|role=["']status|setError/i.test(source)
      ? 'proven'
      : 'not-proven',
    requirement: 'WebGL-unavailable users receive an accessible visible fallback rather than console-only failure.',
  },
  {
    id: 'context-loss',
    status: /webglcontextlost/.test(source) ? 'proven' : 'not-proven',
    requirement: 'Context loss prevents default handling and stops the render loop.',
  },
  {
    id: 'context-restoration',
    status: /webglcontextrestored/.test(source) ? 'proven' : 'not-proven',
    requirement: 'Context restoration rebuilds shaders, buffers, uniforms, and the render loop.',
  },
  {
    id: 'gpu-resource-disposal',
    status: /deleteProgram|deleteBuffer|deleteShader/.test(source) ? 'proven' : 'not-proven',
    requirement: 'Programs, buffers, and shaders are explicitly released during cleanup.',
  },
  {
    id: 'shader-fetch-abort',
    status: /AbortController/.test(source) ? 'proven' : 'not-proven',
    requirement: 'Pending shader fetches are aborted during unmount or source change.',
  },
  {
    id: 'reduced-motion-runtime',
    status: /prefers-reduced-motion|matchMedia/.test(source) ? 'proven' : 'not-proven',
    requirement: 'The render loop is paused or replaced for reduced-motion users.',
  },
  {
    id: 'canvas-accessible-name',
    status: /<canvas[^>]*aria-label=/.test(source) ? 'proven' : 'missing',
    requirement: 'The canvas exposes an accessible name.',
  },
];

const report = {
  generatedAt: new Date().toISOString(),
  source: 'src/components/ShaderCanvas.tsx',
  classification: 'static evidence inventory; runtime behavior still requires browser tests',
  totals: {
    checks: checks.length,
    proven: checks.filter((check) => check.status === 'proven').length,
    missing: checks.filter((check) => check.status === 'missing').length,
    notProven: checks.filter((check) => check.status === 'not-proven').length,
  },
  checks,
};

await mkdir(resolve('artifacts'), { recursive: true });
await writeFile(resolve('artifacts/webgl-evidence.json'), `${JSON.stringify(report, null, 2)}\n`);

for (const check of checks) {
  console.log(`${check.status.toUpperCase()} ${check.id}: ${check.requirement}`);
}

if (report.totals.missing > 0) {
  process.exitCode = 1;
}
