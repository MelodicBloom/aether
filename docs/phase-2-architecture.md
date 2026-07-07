# AETHER Phase 2 — Architecture & Implementation Blueprint

## Shader Source Integration

AETHER's architecture is directly informed by the GLSL collection at [`MelodicBloom/shader-gallery`](https://github.com/MelodicBloom/shader-gallery). The `abalone/` directory contains the Thin-Film and Shell family source shaders. The `sourceMap.ts` registry maps each preset entry to its raw GLSL file path, which may reference either local copies or the shared gallery source.

## Project Structure

```
aether/                           (this repo)
├── shaders/                      # Local GLSL copies or symlinks from shader-gallery
│   ├── thin-film.glsl            # ← from shader-gallery/abalone/
│   ├── shell.glsl                # ← from shader-gallery/abalone/
│   ├── fresnel.glsl
│   ├── bubble.glsl
│   └── holographic.glsl
├── src/
│   ├── components/
│   ├── lib/
│   └── app/
├── supabase/migrations/
└── docs/
```

## Core Modules

| Module | Responsibility |
|--------|----------------|
| `ShaderCanvas` | WebGL rendering engine |
| `ShaderCard` | Presentation wrapper with interaction states |
| `sourceMap.ts` | Canonical preset registry — maps families to GLSL files |
| `variantBuilder.ts` | Runtime configuration layer |
| `glslUtils.ts` | Shader utility functions |
| `gallery/page.tsx` | Primary browsing surface |
| `/api/presets` | Catalog retrieval endpoint |
| `/api/og` | Preview image generation |
| `/api/license` | Licensing and entitlement validation |

## Data Contracts

```typescript
type PresetDefinition = {
  id: string;
  family: PresetFamily;
  name: string;
  title: string;
  slug: string;
  description: string;
  glslPath: string;           // e.g. './shaders/thin-film.glsl'
  uniformsDefault: UniformSpec;
  variantFlags: string[];
  tier: PresetTier;
  tags: string[];
  previewMode: PreviewMode;
  posterImage?: string;
  implementationNotes?: string;
  sourceGalleryRef?: string;  // e.g. 'MelodicBloom/shader-gallery/abalone'
};
```

## Supabase Schema

```sql
CREATE TABLE shader_presets (
  id TEXT PRIMARY KEY,
  family TEXT NOT NULL,
  name TEXT NOT NULL,
  glsl_path TEXT NOT NULL,
  uniforms_default JSONB,
  tier TEXT NOT NULL DEFAULT 'free',
  preview_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  gumroad_order_id TEXT UNIQUE,
  tier TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Definition of Done

Phase 2 is done when every screen, module, token group, schema, and integration point has a name, a responsibility, and a place in the tree. No ambiguity about where code lives or how data flows from `shader-gallery` source → registry → canvas → licensing.
