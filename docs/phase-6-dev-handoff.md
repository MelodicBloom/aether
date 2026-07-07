# AETHER Phase 6 — Developer Handoff

## Handoff Intent

Execution-grade engineering packet for Kimi CLI. Build order, module responsibilities, schema, API contracts, folder structure, acceptance targets, and the final CLI prompt.

## Shader Source Integration

Before creating any GLSL files, check [`MelodicBloom/shader-gallery/abalone`](https://github.com/MelodicBloom/shader-gallery/tree/main/abalone) for existing Thin-Film and Shell source. Copy or adapt those files as the canonical source for the `thin-film` and `shell` family entries in `sourceMap.ts`.

## File Tree Contract

```
MelodicBloom/aether/
├── shaders/
│   ├── thin-film.glsl            # adapted from shader-gallery/abalone/
│   ├── shell.glsl                # adapted from shader-gallery/abalone/
│   ├── fresnel.glsl
│   ├── bubble.glsl
│   ├── holographic.glsl
│   └── [10 more family variants]
├── src/
│   ├── components/
│   │   ├── ShaderCanvas.tsx
│   │   ├── ShaderCard.tsx
│   │   ├── ShaderDetailDrawer.tsx
│   │   ├── FamilyTabs.tsx
│   │   └── UniformControls.tsx
│   ├── lib/
│   │   ├── types.ts
│   │   ├── sourceMap.ts              # canonical registry
│   │   ├── variantBuilder.ts
│   │   ├── glslUtils.ts
│   │   └── access.ts
│   └── app/
│       ├── gallery/page.tsx
│       ├── pricing/page.tsx
│       ├── docs/page.tsx
│       └── api/
│           ├── presets/route.ts
│           ├── license/route.ts
│           └── og/route.ts
├── supabase/migrations/001_initial.sql
├── docs/
│   ├── README.md
│   └── README_SHADER_SYSTEM.md
└── .env.example
```

## Build Order (7 Passes)

1. **Types and Tokens** — `types.ts` + design token layer
2. **Shader Source** — copy from `shader-gallery/abalone/` for Thin-Film + Shell; author remaining 13
3. **Registry** — `sourceMap.ts` + `variantBuilder.ts` + `glslUtils.ts`
4. **Renderer** — `ShaderCanvas.tsx`, `ShaderCard.tsx`, `ShaderDetailDrawer.tsx`
5. **Gallery UI** — `gallery/page.tsx`, `FamilyTabs.tsx`, `UniformControls.tsx`
6. **Backend** — Supabase migrations + `/api/presets`, `/api/license`, `/api/og`
7. **Docs + Packaging** — README, shader-system guide, `.env.example`, Gumroad zip structure

## sourceMap.ts Entries (Thin-Film + Shell)

```typescript
// These two entries reference shaders sourced from MelodicBloom/shader-gallery/abalone
{
  id: 'thin-film-01',
  family: 'thin-film',
  name: 'Thin Film Alpha',
  glslPath: './shaders/thin-film.glsl',
  sourceGalleryRef: 'https://github.com/MelodicBloom/shader-gallery/tree/main/abalone',
  tier: 'free',
  // ...
},
{
  id: 'shell-01',
  name: 'Abalone Shell',
  family: 'shell',
  glslPath: './shaders/shell.glsl',
  sourceGalleryRef: 'https://github.com/MelodicBloom/shader-gallery/tree/main/abalone',
  tier: 'paid',
  // ...
},
```

## Schema

```sql
CREATE TABLE shader_presets (
  id TEXT PRIMARY KEY,
  family TEXT NOT NULL,
  name TEXT NOT NULL,
  glsl_path TEXT NOT NULL,
  uniforms_default JSONB,
  tier TEXT NOT NULL DEFAULT 'free',
  preview_url TEXT,
  source_gallery_ref TEXT,
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

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
AETHER_LICENSE_SECRET=your-license-signing-secret
OG_GENERATION_TOKEN=your-og-auth-token
GUMROAD_WEBHOOK_SECRET=your-gumroad-secret
```

## Kimi CLI Prompt

```text
You are Kimi CLI acting as a senior WebGL product engineer and React architect.

Build AETHER as a premium React/Next.js shader product under MelodicBloom/aether.

IMPORTANT: The Thin-Film and Shell shader source lives in MelodicBloom/shader-gallery/abalone.
Check that repo first and adapt those GLSL files as the canonical source for those two families.
Do not invent placeholder shaders for families that already have source.

IMPLEMENTATION ORDER:
1. Types and design tokens
2. GLSL shaders — copy from shader-gallery/abalone for thin-film + shell; author remaining 13
3. sourceMap.ts registry with sourceGalleryRef fields
4. variantBuilder.ts and glslUtils.ts
5. ShaderCanvas, ShaderCard, ShaderDetailDrawer, FamilyTabs, UniformControls
6. /gallery, /pricing, /docs pages
7. /api/presets, /api/license, /api/og
8. Supabase migrations + RLS
9. README, README_SHADER_SYSTEM.md, .env.example, Gumroad bundle structure

NON-NEGOTIABLE RULES:
- sourceMap.ts is the source of truth.
- Shader previews are the hero of the UI.
- Free vs paid must be elegant, not punitive.
- Public controls are curated.
- Docs, UI, and package use the same naming vocabulary.
- Thin-Film and Shell entries must reference shader-gallery/abalone as upstream source.
- Graceful fallbacks for weak devices.
```

## Definition of Done

Phase 6 is done when Kimi CLI can generate the repo in order, the registry drives UI and APIs, Supabase schema matches the entitlement model, docs match code vocabulary, and Thin-Film/Shell shaders are correctly attributed to `shader-gallery/abalone`.
