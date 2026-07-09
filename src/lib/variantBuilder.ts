import type { PresetRecord, UniformDef } from './types';

export interface ShaderVariant {
  preset: PresetRecord;
  fragmentBody: string;
  uniformValues: Record<string, number | number[]>;
}

export async function loadShaderSource(path: string): Promise<string> {
  const mod = await import(/* @vite-ignore */ `@/../${path}`);
  return (mod as { default: string }).default ?? (mod as unknown as string);
}

export async function buildVariant(
  preset: PresetRecord,
  overrides?: Partial<Record<string, number | number[]>>,
): Promise<ShaderVariant> {
  const fragmentBody = await loadShaderSource(preset.shaderPath);
  const uniformValues: Record<string, number | number[]> = {};
  for (const def of preset.uniforms) {
    uniformValues[def.name] = overrides?.[def.name] ?? def.default;
  }
  return { preset, fragmentBody, uniformValues };
}

export async function buildFreeVariants(): Promise<ShaderVariant[]> {
  const { getFreePresets } = await import('./sourceMap');
  const free = getFreePresets();
  return Promise.all(free.map((p) => buildVariant(p)));
}
