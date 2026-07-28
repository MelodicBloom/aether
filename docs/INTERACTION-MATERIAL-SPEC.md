# AETHER Interaction × Material Specification

## 1. Rendering contract

All live surfaces use one fragment program and a semantic uniform signature:

```ts
{
  family: 0..7,
  speed: 0.01..0.30,
  intensity: 0.40..1.10,
  scale: 0.50..1.60,
  structure: 0..1,
  spectral: 0..1,
  edge: 0..1,
  flow: 0..1,
  depth: 0..1
}
```

The renderer uses one oversized full-screen triangle rather than a two-triangle quad. This removes the shared internal edge that can appear as a diagonal or vertical seam on tiled mobile GPUs. Canvas DPR is capped at 1.75 to reduce thermal load and compositing instability. Offscreen canvases pause through `IntersectionObserver`; hidden tabs do not draw.

## 2. Material classification

| Family | Family ID | Visual primitive | Semantic function | Motion type | Default temporal character |
|---|---:|---|---|---|---|
| Thin Film | 0 | radial interference bands | discovery, changing viewpoint | spectral drift | cyclical, medium |
| Shell | 1 | warped nacre ridges | coherence through variation | viscous bloom | organic, slow-medium |
| Aurora | 2 | luminous curtains | orientation, ambient state | directional flow | broad, slow |
| Fresnel | 3 | bright boundary on dark volume | focus and boundary emphasis | rim resonance | restrained, slow |
| Holographic | 4 | diffraction lattice | structured continuity | scan and tessellation | precise, medium |
| Liquid Metal | 5 | reflective folds | processing and transfer | pressure circulation | viscous, medium |
| Velvet | 6 | directional fibers | receptive/listening state | grazing-light breath | quiet, slow |
| Crystal | 7 | prismatic facets | resolution and decision | crystallization | precise, slow-medium |

## 3. Component signatures

### 3.1 Shader button

**Input listeners**

- `pointerenter`
- `pointerleave`
- `pointerdown`
- `pointerup`
- `click`
- `keydown: Enter`
- `keydown: Space`
- `focus-visible`

**Output behavior**

- Resting: `translateY(0px) scale(1)`.
- Hover/listening: `translateY(-4px) scale(1.01)` over **220 ms**.
- Hover easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Press: `translateY(2px) scale(0.985)` over **90 ms**.
- Press easing: `cubic-bezier(0.4, 0, 1, 1)`.
- Release/resolve: return to hover or rest over **360 ms**.
- Release easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Spring interpretation: stiffness **220**, damping **24**, mass **0.82**.
- Active state: shader opacity `0.74 → 1.0`, saturation `1.0 → 1.2`, brightness `1.0 → 1.08` over **220 ms**.
- Listening state: semantic shader speed `0.08 → 0.16`, no layout shift.

**Recommended family mappings**

- Shell: primary generative action.
- Liquid Metal: processing action.
- Crystal: confirm/resolve action.
- Fresnel: destructive or high-attention boundary action, with restrained saturation.

### 3.2 Shader switch

**Input listeners**

- `click`
- `keydown: Space`
- `aria-checked` state mutation
- optional external controlled-state update

**Output behavior**

- Thumb travel: exactly **34 px**.
- Thumb duration: **280 ms**.
- Thumb easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Track shader opacity: `0.42 → 1.0` over **240 ms**.
- Track saturation: `0.55 → 1.0` over **240 ms**.
- Active shader velocity multiplier: **1.6×**.
- Deactivation velocity decay: **420 ms**, `cubic-bezier(0.16, 1, 0.3, 1)`.
- Active-state curvature: pill radius equal to half of component height; 42 px height means 21 px minimum radius.

**Recommended family mappings**

- Aurora: network/transmission enabled.
- Velvet: listening enabled.
- Holographic: synchronization enabled.
- Thin Film: view mode or optical overlay enabled.

### 3.3 Shader scrollbar

**Input listeners**

- passive `scroll`
- `resize`
- `IntersectionObserver`
- optional pointer hover on track

**Output behavior**

- Scroll progress maps `[0,1]` to fill scale `[0.08,1]`.
- During direct scroll input: **linear, frame-synchronous**, no decorative easing.
- Fill transform origin: bottom.
- Residual shimmer after scroll cessation: **480 ms**.
- Residual easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Resting width: **10 px**.
- Hover width: **14 px**.
- Width transition: **180 ms**, `cubic-bezier(0.22, 1, 0.36, 1)`.
- Track inset: **8 px** from right edge; **10 px** from top and bottom.

**Recommended family mappings**

- Holographic: precise positional telemetry.
- Aurora: continuous narrative drift.
- Liquid Metal: momentum-heavy feeds.

## 4. Scroll-triggered surface behavior

Use normalized section progress rather than raw pixels:

```ts
progress = clamp((viewportHeight - sectionTop) / (sectionHeight + viewportHeight), 0, 1)
```

Suggested mappings:

- `u_flow = mix(0.15, 0.90, progress)`
- `u_edge = mix(0.20, 0.72, progress)`
- `u_depth = mix(0.35, 0.85, smoothstep(0, 1, progress))`
- visual translation: maximum **24 px** over the full section span
- opacity reveal: `0 → 1` across progress `0.08 → 0.28`
- scale reveal: `0.985 → 1` across progress `0.08 → 0.34`

Do not add easing to values while the pointer or scroll wheel is actively driving them. Apply easing only to the settling phase after input stops.

## 5. Seam and line suppression

The visible shader line is treated as a rendering defect, not a motif.

Required controls:

1. Render with one oversized triangle: `[-1,-1], [3,-1], [-1,3]`.
2. Use `gl_FragCoord` and a uniform resolution; do not interpolate UVs between two triangles.
3. Disable antialias, depth, stencil, alpha blending, and preserved drawing buffers.
4. Use opaque canvas output with `alpha: false`.
5. Round canvas pixel dimensions rather than flooring independently.
6. Avoid stacked transparent shader canvases over the same region.
7. Cap DPR at **1.75** on mobile.
8. Keep shader color transitions continuous; avoid hard `step()` boundaries unless deliberately feathered with at least **0.015 normalized units** of `smoothstep` width.

## 6. Accessibility and motion reduction

- Every shader-enhanced control remains a native button or switch with an accessible name.
- Motion never conveys the only indication of state.
- Active state must also change text, `aria-checked`, outline, or contrast.
- Under `prefers-reduced-motion: reduce`, decorative canvas animation may be hidden or replaced by a static gradient while controls remain operational.
- Focus-visible outlines must remain independent of shader brightness.

## 7. Performance limits

- Maximum visible simultaneous live canvases on mobile target: **8**.
- Pause canvases more than **160 px** outside the viewport.
- Target frame rate: **60 fps**; acceptable low-power floor: **30 fps**.
- Per-card DPR cap: **1.75**.
- No more than one fragment shader fetch per source URL; production implementation should add a module-level source cache.
- Avoid more than five FBM octaves on card previews.
