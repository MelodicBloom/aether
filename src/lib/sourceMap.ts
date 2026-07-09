import type { FamilyMeta, PresetRecord } from './types';

/**
 * AETHER sourceMap.ts — canonical preset registry.
 * Maps shader families to GLSL files and preset metadata.
 * The UI reads from this map; no other part of the codebase hard-codes preset lists.
 */

export const FAMILIES: FamilyMeta[] = [
  { id: 'abalone',     label: 'Abalone',     description: 'Organic nacreous iridescence inspired by abalone shell interiors.',         accent: '#6ee7b7' },
  { id: 'thin-film',   label: 'Thin-Film',   description: 'Soap-bubble and oil-slick interference patterns driven by wavelength.',      accent: '#60a5fa' },
  { id: 'shell',       label: 'Shell',       description: 'Layered structural color with directional gradient shifts.',                  accent: '#f0abfc' },
  { id: 'aurora',      label: 'Aurora',      description: 'Atmospheric reference gradient — useful as a free benchmark preset.',         accent: '#a5f3fc' },
  { id: 'fresnel',     label: 'Fresnel',     description: 'Edge-glow rim lighting — locked in v0, coming with paid pack.',             accent: '#fde68a' },
  { id: 'holographic', label: 'Holographic', description: 'Diffractive rainbow grating — locked in v0, coming with paid pack.',         accent: '#c084fc' },
];

export const PRESETS: PresetRecord[] = [
  {
    id: 'abalone-shell-01',
    name: 'Abalone Nacre',
    family: 'abalone',
    description: 'Nacreous iridescence with flowing organic banding, adapted from shader-gallery/abalone.',
    shaderPath: 'shaders/abalone.glsl',
    thumbnail: 'linear-gradient(135deg, #1a2e35 0%, #2dd4bf 30%, #a78bfa 60%, #f0abfc 100%)',
    access: 'free',
    uniforms: [
      { name: 'uIridescence', label: 'Iridescence',     type: 'float', default: 1.0,  min: 0.0, max: 2.0,  step: 0.01 },
      { name: 'uScale',       label: 'Pattern Scale',   type: 'float', default: 3.0,  min: 0.5, max: 10.0, step: 0.1  },
      { name: 'uSpeed',       label: 'Animation Speed', type: 'float', default: 0.3,  min: 0.0, max: 2.0,  step: 0.01 },
    ],
    tags: ['iridescent', 'organic', 'nacre'],
  },
  {
    id: 'thin-film-01',
    name: 'Thin-Film Interference',
    family: 'thin-film',
    description: 'Wavelength-based interference producing soap-bubble color shifts.',
    shaderPath: 'shaders/thin-film.glsl',
    thumbnail: 'linear-gradient(135deg, #0c1929 0%, #38bdf8 40%, #818cf8 70%, #e879f9 100%)',
    access: 'free',
    uniforms: [
      { name: 'uThickness', label: 'Film Thickness', type: 'float', default: 400.0, min: 100.0, max: 800.0, step: 1.0  },
      { name: 'uSpeed',     label: 'Flow Speed',     type: 'float', default: 0.5,   min: 0.0,   max: 2.0,   step: 0.01 },
    ],
    tags: ['iridescent', 'interference', 'soap-bubble'],
  },
  {
    id: 'aurora-01',
    name: 'Aurora Reference',
    family: 'aurora',
    description: 'Free reference gradient demonstrating the FBM noise pipeline. Not premium, but useful.',
    shaderPath: 'shaders/thin-film.glsl',
    thumbnail: 'linear-gradient(180deg, #052e16 0%, #34d399 40%, #67e8f9 70%, #f0abfc 100%)',
    access: 'free',
    uniforms: [
      { name: 'uThickness', label: 'Glow Intensity', type: 'float', default: 500.0, min: 100.0, max: 800.0, step: 1.0 },
      { name: 'uSpeed',     label: 'Speed',          type: 'float', default: 0.2,   min: 0.0,   max: 2.0,   step: 0.01 },
    ],
    tags: ['reference', 'fbm', 'gradient'],
  },
  {
    id: 'fresnel-01',
    name: 'Fresnel Rim',
    family: 'fresnel',
    description: 'Rim-light edge glow. Locked — available in the paid package.',
    shaderPath: 'shaders/shell.glsl',
    thumbnail: 'linear-gradient(135deg, #1c1917 0%, #fde68a 50%, #fef3c7 100%)',
    access: 'paid',
    uniforms: [],
    tags: ['rim-light', 'edge-glow', 'locked'],
  },
  {
    id: 'holographic-01',
    name: 'Holographic Grating',
    family: 'holographic',
    description: 'Diffractive rainbow grating effect. Locked — available in the paid package.',
    shaderPath: 'shaders/shell.glsl',
    thumbnail: 'linear-gradient(135deg, #1e1b4b 0%, #c084fc 50%, #f0abfc 100%)',
    access: 'paid',
    uniforms: [],
    tags: ['diffraction', 'rainbow', 'locked'],
  },
];

export function getPresetsByFamily(family: string): PresetRecord[] {
  return PRESETS.filter((p) => p.family === family);
}
export function getPresetById(id: string): PresetRecord | undefined {
  return PRESETS.find((p) => p.id === id);
}
export function getFreePresets(): PresetRecord[] {
  return PRESETS.filter((p) => p.access === 'free');
}
export function getPaidPresets(): PresetRecord[] {
  return PRESETS.filter((p) => p.access === 'paid');
}
