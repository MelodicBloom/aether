import type { PresetDefinition } from './types';

const upstream = 'https://github.com/MelodicBloom/shader-gallery/tree/main/abalone';

export const presets: PresetDefinition[] = [
  {
    id: 'thin-film-01',
    family: 'thin-film',
    title: 'Thin Film Alpha',
    description: 'Angle-shifting interference with a restrained luminous edge.',
    glslPath: '/shaders/abalone.frag',
    tier: 'free',
    tags: ['interference', 'iridescence', 'surface'],
    semanticRole: 'discovery through changing perspective',
    emotionalGradient: ['curiosity', 'clarity'],
    motionToken: 'motion.discovery.drift',
    sourceGalleryRef: upstream,
    uniformsDefault: { speed: 0.16, intensity: 0.9, scale: 1.05, family: 0, structure: 0.32, spectral: 1.0, edge: 0.7 }
  },
  {
    id: 'shell-01',
    family: 'shell',
    title: 'Abalone Shell',
    description: 'Layered nacre shimmer with organic depth and pearl-like highlights.',
    glslPath: '/shaders/abalone.frag',
    tier: 'free',
    tags: ['nacre', 'organic', 'pearl'],
    semanticRole: 'material coherence emerging from layered variation',
    emotionalGradient: ['wonder', 'confidence'],
    motionToken: 'motion.transition.bloom',
    sourceGalleryRef: upstream,
    uniformsDefault: { speed: 0.1, intensity: 0.82, scale: 1.35, family: 1, structure: 0.88, spectral: 0.72, edge: 0.28 }
  },
  {
    id: 'aurora-01',
    family: 'aurora',
    title: 'Aurora Veil',
    description: 'A cool-spectrum atmospheric variant for broad ambient surfaces.',
    glslPath: '/shaders/abalone.frag',
    tier: 'free',
    tags: ['ambient', 'veil', 'atmosphere'],
    semanticRole: 'orientation and environmental tone',
    emotionalGradient: ['distance', 'invitation'],
    motionToken: 'motion.discovery.orbit',
    sourceGalleryRef: upstream,
    uniformsDefault: { speed: 0.065, intensity: 0.72, scale: 0.7, family: 2, structure: 0.48, spectral: 0.86, edge: 0.18 }
  },
  {
    id: 'fresnel-01',
    family: 'fresnel',
    title: 'Fresnel Halo',
    description: 'Angle-dependent edge glow prepared for the paid production family.',
    tier: 'paid',
    tags: ['edge', 'halo', 'reflectance'],
    semanticRole: 'focus through boundary emphasis',
    emotionalGradient: ['diffusion', 'attention'],
    motionToken: 'motion.focus.resonate',
    uniformsDefault: { speed: 0.2, intensity: 0.9, scale: 1.0, family: 3, structure: 0.3, spectral: 0.45, edge: 1.0 }
  },
  {
    id: 'holographic-01',
    family: 'holographic',
    title: 'Holographic Lattice',
    description: 'A locked foil-and-diffraction family reserved for the complete library.',
    tier: 'paid',
    tags: ['foil', 'diffraction', 'lattice'],
    semanticRole: 'continuity through structured variation',
    emotionalGradient: ['fragmentation', 'coherence'],
    motionToken: 'motion.structure.tessellate',
    uniformsDefault: { speed: 0.16, intensity: 0.8, scale: 1.4, family: 4, structure: 1.0, spectral: 1.0, edge: 0.5 }
  }
];

export const families = ['all', ...Array.from(new Set(presets.map((preset) => preset.family)))] as const;