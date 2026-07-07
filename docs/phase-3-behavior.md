# AETHER Phase 3 — Experience Behavior & Systems Wiring

## Experience Logic

The gallery experience should feel immediate, premium, and legible. The shader is always the hero element. Users can scan the grid quickly, recognize family differences (Thin-Film vs Shell vs Fresnel), and open a preset detail state without losing spatial context.

The abalone-derived presets (from [`shader-gallery/abalone`](https://github.com/MelodicBloom/shader-gallery/tree/main/abalone)) are the visual anchors of the experience and should be among the strongest free-tier showcase presets.

## Primary Interaction Model

**Browse → Hover → Inspect → Adjust → Convert**

| Step | Surface | Notes |
|------|---------|-------|
| Browse | Gallery grid | Scan families and thumbnails |
| Hover | Card | Subtle motion cues, increased quality confidence |
| Inspect | Detail drawer | Richer preview, semantics, controls |
| Adjust | Uniform controls | Limited preview manipulation |
| Convert | Pricing CTA | License or download path |

## Motion System

| Primitive | Purpose |
|-----------|----------|
| Card tilt | Tactility |
| Elevation | Focus |
| Highlight sweep | Material sheen |
| Tab underline | Category change |
| Modal fade-scale | Context entry/exit |

**Rules:** Easing is smooth and intentional. Shimmer is periodic, not noisy. Motion never makes the grid feel unstable.

## Free and Paid UX

| State | What User Can Do |
|-------|------------------|
| Free — Visible | Recognize preset exists in catalog |
| Free — Inspectable | See enough to evaluate relevance |
| Paid — Unlockable | Clear, friction-minimized upgrade path |

Lock states use soft blur, lock badges, restrained copy. Never aggressive interruption.

## Source Map and Variant Behavior

`sourceMap.ts` maps preset entries to GLSL source files. For Thin-Film and Shell presets, `sourceGalleryRef` should point back to `MelodicBloom/shader-gallery/abalone` for attribution and traceability.

Merge order in `variantBuilder.ts`:
1. Preset defaults
2. Family defaults
3. Local overrides

## Rendering Flow

```
Preset selection
  → sourceMap resolution
    → GLSL load (from /shaders/ or shader-gallery ref)
      → shader compilation
        → uniform initialization
          → animation frame scheduling
            → resize handling
              → cleanup
```

## Definition of Done

Every user-visible behavior is defined: hover response, filtering, detail open/close, preview controls, free vs paid state, catalog fetch, automation roles. No ambiguity about what happens when a user clicks a locked preset, a canvas goes offscreen, or a preset object becomes a live preview.
