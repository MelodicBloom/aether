export type PresetFamily = 'thin-film' | 'shell' | 'aurora' | 'fresnel' | 'holographic';
export type PresetTier = 'free' | 'paid';

export type UniformSpec = {
  speed: number;
  intensity: number;
  scale: number;
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
