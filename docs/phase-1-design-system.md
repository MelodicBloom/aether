# AETHER Phase 1 — Design & System Definition

## Related Source

The thin-film and abalone GLSL shaders that anchor the Thin-Film and Shell families live in [`MelodicBloom/shader-gallery/abalone`](https://github.com/MelodicBloom/shader-gallery/tree/main/abalone). AETHER wraps these into production-ready components.

## Product Intent

AETHER is a premium shader library for React and Next.js developers who want iridescent, luminous UI surfaces without writing GLSL from scratch. The product should feel technically credible, visually luxurious, and immediately useful, with a freemium demo that converts into a paid source package.

The phase goal is not code completion; it is to lock the product definition so build, marketing, and documentation all align.

## User Profile

**Primary:** A React or Next.js developer who wants premium visual polish without spending time hand-authoring shader math.

**Secondary:** Creative technologists, portfolio builders, and indie product makers who want visual differentiation and a reusable component asset.

The interface must serve two modes at once: exploratory browsing for inspiration and precise technical inspection for implementation.

## Narrative Structure

> “Drop in premium iridescence, move fast, and keep the codebase understandable.”

The emotional arc: **discovery → confidence**

- Gallery attracts attention
- Preview demonstrates quality
- Technical detail panels make the asset feel safe to adopt

## Preset Taxonomy

Organized by **material and optical behavior**, not just visual look:

| Family | Behavior | GLSL Source |
|--------|----------|-------------|
| Thin-Film | Interference patterns from thin transparent layers | `shader-gallery/abalone/` |
| Fresnel | Angle-dependent reflectance and glow | TBD |
| Bubble | Soap film iridescence with translucency | TBD |
| Shell | Abalone/nacre layered shimmer | `shader-gallery/abalone/` |
| Holographic | Foil-like prismatic diffraction | TBD |

## Token Model

Built around: glow, sheen, contrast, depth, edge behavior.

Covers: background gradients, border opacity, shadow softness, specular intensity, highlight color, panel blur/translucency.

Purpose: make gallery, cards, modals, and demo surfaces feel like one continuous material language.

## UX Logic

Three main behaviors:

| Behavior | Description | Tier |
|----------|-------------|------|
| Browse | Scan families and thumbnails | Free |
| Inspect | Open preset detail with technical info | Free (light) / Paid (deep) |
| Compare | Move between presets to evaluate differences | Paid |

## Screens

| Screen | Role |
|--------|------|
| Landing Gallery | Primary browsing surface |
| Preset Detail Drawer/Modal | Evaluation surface |
| Pricing/Licensing | Access clarity |
| Developer Documentation | Adoption support |

## Motion Heuristics

- Hover tilt: shallow, intentional
- Shimmer sweeps: periodic, not noisy
- Card elevation: smooth
- Tab transitions: fast, contextual

**Heuristic:** Motion helps users understand hierarchy. It does not compete with the previews.

## Definition of Done

Phase 1 is done when the project has stable product framing, a named user, a complete design spec, a hierarchy of pages and screens, a preset taxonomy, a token system, animation heuristics, a written success model for the freemium-to-paid path, and definitions of free and paid tiers.
