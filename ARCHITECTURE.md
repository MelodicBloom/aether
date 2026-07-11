# ARCHITECTURE: MelodicBloom — nacre-orchid + aether

**Version:** 1.0.0
**Org:** `MelodicBloom`
**Last updated:** 2026-07-09

---

## Org-level split

| Repo | Role | Status |
|---|---|---|
| `MelodicBloom/nacre-orchid` | Product / site / platform | Active — vertical slice on `nacre-orchid-vertical-slice` |
| `MelodicBloom/aether` | Shader / effects / iridescent surface library | Active — receives WebGL and GLSL work |

This split is intentional and permanent. Do not collapse these repos. `nacre-orchid` consumes visual primitives from `aether` over time as progressive WebGL enhancement. CSS/SVG surfaces in `nacre-orchid` are the fallback layer; `aether` shaders are the enhancement layer.

---

## nacre-orchid — layer map

```
App layer          layout.tsx · page.tsx · gallery/page.tsx
Shell layer        ShellRoot → CursorLight + SiteNav
Primitive layer    PearlButton · TokenChip · SemanticMeter
Surface layer      NacreCard · AbaloneTile · LaceModal
Flow layer         ReliquaryHero · ArtifactGrid · StudioPreview
Lib layer          artifacts · taxonomy · tokens · motion
Style layer        tokens → globals → surfaces → motion → accessibility → screens
```

### Dependency direction

```
Flows
  └─ Surfaces + Primitives
       └─ Lib (taxonomy, tokens, motion)
            └─ Styles (tokens.css as source of truth)
```

Styles flow **down** through CSS custom properties. Semantic meaning flows **up** through `lib/taxonomy.ts`. Components never import from a higher layer.

---

## aether — role and layer map

aether is the **shader / effects / iridescent surface library** for the MelodicBloom org. It receives all WebGL and GLSL development that would be too heavy for the nacre-orchid CSS/SVG fallback layer.

```
Shader primitives     GLSL surface functions (nacre, abalone, opal, labradorite)
Effect composers      WebGL canvas wrappers
nacre-orchid bridge   <AbaloneTile shader={true}> — drops in over CSS surface
```

The bridge pattern means nacre-orchid components accept an optional `shader` prop that swaps the CSS surface for a WebGL canvas from aether. This keeps the component API stable while enabling progressive visual enhancement.

---

## Token architecture

Single source of truth: `MelodicBloom/nacre-orchid` → `src/styles/tokens.css`

Downstream consumers:
- CSS components via `var(--token-name)`
- `src/lib/tokens.ts` — JS/TS references for Framer Motion
- (next phase) `design-tokens.json` — W3C DTCG export for design tools and other repos
- aether shaders reference the same color values for surface consistency

Token categories:
```
colors · surfaces · radii · spacing · shadows · glows
motion easing · durations · focus rings · z-index layers
```

---

## Semantic architecture

Material and motion semantics are defined once in `nacre-orchid/src/lib/taxonomy.ts`.

**Never hard-code a material name as a string.** Always reference the `Material` type from `taxonomy.ts`.

When aether shaders are created, they should use the same material naming convention:
- `nacre` → pearl surface
- `abalone` → iridescent depth tile
- `opal` → responsive shimmer
- `labradorite` → dark mineral background

---

## Issue / brief lineage

```
qt314wink/nextjs-boilerplate (original staging)
  └─ MelodicBloom/aether#1 (MelodicBloom staging brief — CLOSED)
       └─ MelodicBloom/nacre-orchid#1 (CANONICAL build brief — OPEN)
```

All future build planning should reference and close against `nacre-orchid#1`.
aether issues should be scoped to shader/effects/WebGL work only.

---

## Phase map

| Phase | Status | Gate |
|---|---|---|
| 0. Org + repo setup | ✅ Complete | nacre-orchid repo live, branch created |
| 1. Vertical slice scaffold | ✅ Complete | 27 files committed, brief migrated |
| 2. Quality gate pass | 🔲 Next | All 15 QA items checked, CI passing |
| 3. Token export | 🔲 Next | design-tokens.json (W3C DTCG) |
| 4. CI/CD | 🔲 Next | GitHub Actions lint + type-check + build |
| 5. SVG filter layer | 🔲 Queued | Nacre distortion, lace texture, shimmer |
| 6. Storybook | 🔲 Queued | Stories for all primitives + surfaces |
| 7. aether bridge | 🔲 Queued | First shader import from MelodicBloom/aether |
| 8. Auth + persistence | 🔲 Future | Pearl save state wired to storage |
| 9. Marketplace | 🔲 Future | Gold-gated premium, pricing tiers |

---

## Related

- [MelodicBloom/nacre-orchid](https://github.com/MelodicBloom/nacre-orchid) — product / site / platform
- [nacre-orchid#1](https://github.com/MelodicBloom/nacre-orchid/issues/1) — canonical build brief
- [aether#1](https://github.com/MelodicBloom/aether/issues/1) — staging brief (closed, migrated)
