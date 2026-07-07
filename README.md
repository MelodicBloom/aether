# AETHER

> Premium iridescent GLSL shader library for React / Next.js

AETHER is a freemium shader component product built on top of the raw GLSL collection in [`MelodicBloom/shader-gallery`](https://github.com/MelodicBloom/shader-gallery). It wraps those shaders into production-ready React components with semantic controls, a hosted browsing gallery, and a paid source package.

## Source Shaders

The thin-film and abalone shader source lives in:

```
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
