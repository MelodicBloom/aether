export type PresetFamily =
  | 'thin-film'
  | 'shell'
  | 'aurora'
  | 'fresnel'
  | 'holographic'
  | 'liquid-metal'
  | 'velvet'
  | 'crystal'
  | 'ion-bloom'
  | 'plasma-bloom'
  | 'opal-glass'
  | 'magnetic-ink'
  | 'electric-mesh'
  | 'quantum-knot'
  | 'wave-function'
  | 'lorenz-field'
  | 'reaction-diffusion'
  | 'phyllotaxis'
  | 'mycelial-field';

export type PresetTier = 'free' | 'paid';

export type UniformSpec = {
  speed: number;
  intensity: number;
  scale: number;
  family: number;
  structure: number;
  spectral: number;
  edge: number;
  flow: number;
  depth: number;
};

export type PresetDefinition = {
  id: string;
  family: PresetFamily;
  title: string;
  description: string;
  glslPath?: string;
  tier: PresetTier;
  tags: string[];
  semanticRole: string;
  emotionalGradient: [string, string];
  motionToken: string;
  sourceGalleryRef?: string;
  uniformsDefault: UniformSpec;
};

export type InteractionSignature = {
  id: string;
  component: 'button' | 'switch' | 'scrollbar' | 'surface';
  listensFor: string[];
  output: string;
  durationMs: number;
  distancePx: number;
  easing: string;
  curvature: string;
  dynamics: string;
  activeState: string;
};