# AETHER

> Premium iridescent GLSL shader library for React / Next.js

AETHER is a freemium shader component product built on top of the raw GLSL collection in [`MelodicBloom/shader-gallery`](https://github.com/MelodicBloom/shader-gallery). It wraps those shaders into production-ready React components with semantic controls, a hosted browsing gallery, and a paid source package.

## Runnable v0

The first vertical slice is now implemented as a Next.js gallery:

- live WebGL fragment-shader rendering
- semantic `sourceMap.ts` preset registry
- family filtering
- inspect drawer with intent, emotional-gradient, motion-token, and source metadata
- graceful free and paid catalog states
- reduced-motion-aware presentation layer

### Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Validation commands:

```bash
npm run typecheck
npm run lint
npm run build
```

## Verification status

The verification workflow is defined in `.github/workflows/verify-aether-v0.yml` and is intentionally strict:

1. require `package-lock.json`
2. install frozen dependencies with `npm ci`
3. run typecheck
4. run lint
5. run the production build
6. record the explicitly declared test surface
7. create a deterministic build archive and SHA-256 digest
8. retain verification evidence as a GitHub Actions artifact

A frozen installation cannot currently complete because this branch does not contain `package-lock.json`. The workflow reports that as a blocking failure and does not silently fall back to `npm install`. Adding or repairing the lockfile requires separate approval because the lockfile is outside the default verification-only scope.

Manual verification plans:

- [`docs/verification/WEBGL_SMOKE_TEST.md`](./docs/verification/WEBGL_SMOKE_TEST.md)
- [`docs/verification/ACCESSIBILITY_CHECKLIST.md`](./docs/verification/ACCESSIBILITY_CHECKLIST.md)

A missing test script is reported as **not declared**, never as passed.

## Architecture

```text
public/shaders/abalone.frag
        ↓
src/lib/sourceMap.ts
        ↓
src/components/ShaderCanvas.tsx
        ↓
src/app/page.tsx
```

`sourceMap.ts` is the canonical catalog. UI surfaces consume preset definitions rather than duplicating shader metadata or access rules.

Each preset currently carries:

- family and tier
- GLSL source path
- semantic role
- emotional gradient
- motion token
- curated uniform defaults
- upstream source reference

## Source Shaders

The thin-film and abalone shader source lives in:

```text
MelodicBloom/shader-gallery/
├── abalone/   ← Thin-Film + Shell family source
└── aurora/    ← Secondary reference family
```

AETHER's `sourceMap.ts` registry maps directly to these GLSL files.

## Families

| Family | Source in shader-gallery | Behavior |
|--------|--------------------------|----------|
| Thin-Film | `abalone/` | Interference patterns from thin transparent layers |
| Shell | `abalone/` | Abalone/nacre layered shimmer |
| Fresnel | TBD | Angle-dependent reflectance and glow |
| Bubble | TBD | Soap film iridescence with translucency |
| Holographic | TBD | Foil-like prismatic diffraction |

## Pricing

| Tier | Price | Scope |
|------|-------|-------|
| Free | $0 | Freemium gallery, 5 inspectable presets |
| Single Developer | $79 | Full 15-preset library + source package |
| Commercial / Team | $249 | Unlimited projects, client work |

## Docs

See [`/docs`](./docs/) for the full six-phase product specification.

## Related Repos

- [`MelodicBloom/shader-gallery`](https://github.com/MelodicBloom/shader-gallery) — Raw GLSL source collection (abalone, aurora, and more)
