import type { PresetDefinition } from './types';

const upstream = 'https://github.com/MelodicBloom/shader-gallery/tree/main/abalone';
const shader = '/shaders/abalone.frag';

export const presets: PresetDefinition[] = [
  {
    id: 'thin-film-01', family: 'thin-film', title: 'Thin Film Alpha',
    description: 'Angle-shifting interference with restrained spectral rings.', glslPath: shader, tier: 'free',
    tags: ['interference', 'iridescence', 'surface'], semanticRole: 'discovery through changing perspective',
    emotionalGradient: ['curiosity', 'clarity'], motionToken: 'motion.discovery.drift', sourceGalleryRef: upstream,
    uniformsDefault: { speed: 0.16, intensity: 0.9, scale: 1.05, family: 0, structure: 0.22, spectral: 1, edge: 0.7, flow: 0.45, depth: 0.35 }
  },
  {
    id: 'shell-01', family: 'shell', title: 'Abalone Shell',
    description: 'Layered nacre shimmer with organic depth and pearl-like highlights.', glslPath: shader, tier: 'free',
    tags: ['nacre', 'organic', 'pearl'], semanticRole: 'material coherence emerging from layered variation',
    emotionalGradient: ['wonder', 'confidence'], motionToken: 'motion.transition.bloom', sourceGalleryRef: upstream,
    uniformsDefault: { speed: 0.1, intensity: 0.82, scale: 1.35, family: 1, structure: 0.88, spectral: 0.72, edge: 0.28, flow: 0.72, depth: 0.9 }
  },
  {
    id: 'aurora-01', family: 'aurora', title: 'Aurora Veil',
    description: 'A cool-spectrum atmospheric field with flowing luminous curtains.', glslPath: shader, tier: 'free',
    tags: ['ambient', 'veil', 'atmosphere'], semanticRole: 'orientation and environmental tone',
    emotionalGradient: ['distance', 'invitation'], motionToken: 'motion.discovery.orbit', sourceGalleryRef: upstream,
    uniformsDefault: { speed: 0.065, intensity: 0.72, scale: 0.7, family: 2, structure: 0.34, spectral: 0.86, edge: 0.18, flow: 1, depth: 0.55 }
  },
  {
    id: 'fresnel-01', family: 'fresnel', title: 'Fresnel Halo',
    description: 'Dark optical volume with a responsive, angle-dependent luminous rim.', glslPath: shader, tier: 'free',
    tags: ['edge', 'halo', 'reflectance'], semanticRole: 'focus through boundary emphasis',
    emotionalGradient: ['diffusion', 'attention'], motionToken: 'motion.focus.resonate', sourceGalleryRef: upstream,
    uniformsDefault: { speed: 0.12, intensity: 0.9, scale: 0.92, family: 3, structure: 0.18, spectral: 0.48, edge: 1, flow: 0.32, depth: 0.82 }
  },
  {
    id: 'holographic-01', family: 'holographic', title: 'Holographic Lattice',
    description: 'Fine diffraction grid with spectral scanning and foil-like shimmer.', glslPath: shader, tier: 'free',
    tags: ['foil', 'diffraction', 'lattice'], semanticRole: 'continuity through structured variation',
    emotionalGradient: ['fragmentation', 'coherence'], motionToken: 'motion.structure.tessellate', sourceGalleryRef: upstream,
    uniformsDefault: { speed: 0.14, intensity: 0.82, scale: 1.15, family: 4, structure: 1, spectral: 1, edge: 0.45, flow: 0.58, depth: 0.4 }
  },
  {
    id: 'liquid-metal-01', family: 'liquid-metal', title: 'Mercury Current',
    description: 'Reflective liquid-metal folds with slow pressure-driven circulation.', glslPath: shader, tier: 'free',
    tags: ['metal', 'viscous', 'reflective'], semanticRole: 'active processing and energetic transfer',
    emotionalGradient: ['pressure', 'release'], motionToken: 'motion.processing.current', sourceGalleryRef: upstream,
    uniformsDefault: { speed: 0.09, intensity: 0.86, scale: 1.1, family: 5, structure: 0.64, spectral: 0.32, edge: 0.66, flow: 0.9, depth: 1 }
  },
  {
    id: 'velvet-01', family: 'velvet', title: 'Velvet Signal',
    description: 'Soft directional fibers with grazing-light compression and bloom.', glslPath: shader, tier: 'free',
    tags: ['fiber', 'soft', 'grazing-light'], semanticRole: 'listening, waiting, and receptive state',
    emotionalGradient: ['quiet', 'readiness'], motionToken: 'motion.listening.breathe', sourceGalleryRef: upstream,
    uniformsDefault: { speed: 0.055, intensity: 0.78, scale: 1.2, family: 6, structure: 0.78, spectral: 0.44, edge: 0.2, flow: 0.28, depth: 0.68 }
  },
  {
    id: 'crystal-01', family: 'crystal', title: 'Prismatic Crystal',
    description: 'Faceted translucent geometry with refracted spectral seams.', glslPath: shader, tier: 'free',
    tags: ['facet', 'refraction', 'prism'], semanticRole: 'decision points and resolved structure',
    emotionalGradient: ['ambiguity', 'resolution'], motionToken: 'motion.resolve.crystallize', sourceGalleryRef: upstream,
    uniformsDefault: { speed: 0.08, intensity: 0.88, scale: 1, family: 7, structure: 0.92, spectral: 0.92, edge: 0.72, flow: 0.18, depth: 0.86 }
  }
];

export const families = ['all', ...Array.from(new Set(presets.map((preset) => preset.family)))] as const;