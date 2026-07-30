# WebGL Runtime Lifecycle Contract

Status: approved implementation contract
Approved: 2026-07-30

## Required behavior

- A failed or unavailable WebGL context exposes a visible fallback and an equivalent screen-reader message.
- `webglcontextlost` prevents default browser disposal behavior, pauses rendering, and records a bounded diagnostic event.
- `webglcontextrestored` rebuilds renderer-owned resources and resumes only after successful reconstruction.
- In-flight shader or asset requests are cancellable on replacement and unmount.
- Reduced-motion mode avoids continuous decorative motion while preserving a meaningful rendered state.
- Unmount cancels animation frames, listeners, requests, observers, and GPU resources.
- Healthy-path shader appearance remains unchanged.

## Browser evidence matrix

| Scenario | Expected evidence |
|---|---|
| Null context | Fallback visible; accessible status present; no uncaught error |
| Context loss | Frame scheduling stops; diagnostic event emitted |
| Context restoration | Resources reconstructed; canvas becomes nonblank |
| Unmount | No later frames; no listeners; no unresolved request |
| Reduced motion | Stable meaningful frame; no continuous decorative loop |
| Healthy context | Existing visual snapshot remains within approved tolerance |

## Test boundary

Allowed paths:

- `src/components/ShaderCanvas.tsx`
- `tests/webgl/**`
- `docs/verification/WEBGL_LIFECYCLE_CONTRACT.md`
- `.github/workflows/webgl-browser-evidence.yml`

Forbidden scope includes shader redesign, token changes, pricing, entitlement, dependency migration, and unrelated visual work.

## Approval gate

The PR may move from draft only when browser evidence covers every scenario above and the healthy visual snapshot has no unexplained delta.
