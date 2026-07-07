# AETHER Phase 4 — Acceptance, Packaging & Launch Readiness

## Phase Role

Phase 4 validates not only whether the code works, but whether the product is understandable, desirable, trustworthy, and ready to distribute.

## Product Acceptance Criteria

AETHER is launch-ready when a new user can:
- [ ] Understand the product value within seconds
- [ ] Browse families without confusion
- [ ] Inspect at least one free preset deeply enough to trust quality
- [ ] Understand what paid access unlocks
- [ ] Reach documentation or purchase without friction

## Technical Definition of Done

- All 15 presets mapped through the canonical registry
- Thin-Film and Shell presets correctly sourced from `shader-gallery/abalone/`
- Canvas wrapper renders presets consistently
- Gallery filters correctly by family
- Free-versus-paid state behaves predictably
- Supabase-backed licensing and metadata in place
- OG preview generation path exists
- Hosted demo and distributable source package both valid outputs of the same system

## Distribution Structure

```
aether-v1.0/
├── shaders/
│   ├── thin-film.glsl     # sourced from shader-gallery/abalone
│   ├── shell.glsl         # sourced from shader-gallery/abalone
│   ├── fresnel.glsl
│   ├── bubble.glsl
│   ├── holographic.glsl
│   └── [...10 more]
├── src/
│   ├── components/
│   └── lib/
├── docs/
│   ├── README.md
│   └── README_SHADER_SYSTEM.md
└── LICENSE
```

## Release Checklist

- [ ] All 15 presets registered
- [ ] Family tabs working correctly
- [ ] Thin-Film and Shell presets link back to shader-gallery source
- [ ] Free presets clearly inspectable
- [ ] Paid presets clearly differentiated
- [ ] Docs consistent with code vocabulary
- [ ] README and shader-system guide present
- [ ] OG previews generated or generation path functional
- [ ] Downloadable package structured cleanly
- [ ] Hosted demo matches packaged source organization
