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
    uniformsDefault: { speed: 0.18, intensity: 0.72, scale: 1.0 }
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
    uniformsDefault: { speed: 0.12, intensity: 0.88, scale: 1.25 }
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
    uniformsDefault: { speed: 0.09, intensity: 0.58, scale: 0.82 }
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
    uniformsDefault: { speed: 0.2, intensity: 0.9, scale: 1.0 }
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
    uniformsDefault: { speed: 0.16, intensity: 0.8, scale: 1.4 }
  }
];

export const families = ['all', ...Array.from(new Set(presets.map((preset) => preset.family)))] as const;
