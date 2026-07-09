export type ShaderFamily =
  | 'abalone'
  | 'thin-film'
  | 'shell'
  | 'aurora'
  | 'fresnel'
  | 'holographic';

export type AccessTier = 'free' | 'paid';

export interface UniformDef {
  name: string;
  label: string;
  type: 'float' | 'vec2' | 'vec3' | 'vec4' | 'color';
  default: number | number[];
  min?: number;
  max?: number;
  step?: number;
}

export interface PresetRecord {
  id: string;
  name: string;
  family: ShaderFamily;
  description: string;
  shaderPath: string;
  thumbnail: string;
  access: AccessTier;
  uniforms: UniformDef[];
  tags: string[];
}

export interface FamilyMeta {
  id: ShaderFamily;
  label: string;
  description: string;
  accent: string;
}
