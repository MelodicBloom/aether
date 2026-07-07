# AETHER Phase 5 — Release, Storefront & Distribution

## Phase Purpose

Formalize the commercial presentation: hosted gallery, pricing page, Gumroad listing, downloadable zip, and documentation — all as one coherent product with one vocabulary and one promise.

## Commercial Framing

> “A premium WebGL shader library for React and Next.js developers who want iridescent, luminous UI surfaces without writing GLSL from scratch.”

Built on the abalone/thin-film GLSL collection from [`MelodicBloom/shader-gallery`](https://github.com/MelodicBloom/shader-gallery).

## Product Tiers

| Tier | Price | Scope |
|------|-------|-------|
| Free | $0 | Freemium gallery, 5 inspectable presets |
| Single Developer | $79 | Full 15-preset library, source package |
| Commercial / Team | $249 | Unlimited projects, client work |

## Gumroad Listing

```
AETHER — 15 Premium Iridescent GLSL Shader Presets for React / Next.js

Turn any UI surface into luminous, touch-responsive glass. Zero GLSL required.

Drop museum-quality iridescent effects into your React app in minutes. AETHER gives
you 15 production-tuned WebGL shader presets — Thin-Film interference, Fresnel glow,
Soap Bubble, Abalone Shell, and Holographic foil — each with semantic TypeScript props,
variant flags for instant visual tweaking, and a sourceMap.ts that maps every
preset to its raw GLSL for full customization when you’re ready.

What’s included:
✦ 15 .glsl shader files + TypeScript wrapper components
✦ sourceMap.ts with variant builder configs per family
✦ Interactive demo gallery (live Vercel deploy)
✦ README + README_SHADER_SYSTEM.md developer guide
✦ Preset-to-template mapping table + debugging guide
✦ Commercial-use license (team tier)

$79 — Single developer license
$249 — Commercial / team license

Free interactive demo → [Vercel URL]
```

## README Alignment

| Document | Covers |
|----------|--------|
| README.md | Installation, file organization, preset families, wrapper usage |
| README_SHADER_SYSTEM.md | Taxonomy, registry logic, variant behavior, debugging, extension |

Both documents must reference `shader-gallery/abalone` as the upstream GLSL source for the Thin-Film and Shell families.

## Definition of Done

If a buyer can see the gallery → read the listing → open the zip → read the docs without ever wondering if these are the same product, and can trace the Thin-Film / Shell shaders back to `MelodicBloom/shader-gallery`, the phase is complete.
