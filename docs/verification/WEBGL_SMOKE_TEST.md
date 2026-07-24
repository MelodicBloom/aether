# AETHER v0 WebGL Smoke-Test Plan

## Purpose

Verify that the existing AETHER v0 gallery renders, degrades, and cleans up correctly without changing visual or product behavior.

## Environments

Run the checks against the production build on:

- Chromium desktop with hardware acceleration enabled
- Firefox desktop
- Safari desktop when available
- one mobile-class viewport at 390 × 844
- one reduced-capability or software-rendered WebGL environment when available

Record browser version, operating system, GPU renderer, commit SHA, viewport, and result for every run.

## Required checks

### Initial render

1. Start the production server from a successful `npm run build`.
2. Open the gallery root.
3. Confirm the canvas initializes without console errors.
4. Confirm at least one shader frame is visibly rendered.
5. Confirm family filters and the inspection drawer remain usable while the canvas is active.

### Shader compilation and runtime

1. Capture any shader compile or link errors.
2. Confirm missing or malformed shader source produces a readable fallback rather than a blank or frozen page.
3. Confirm animation continues for at least 60 seconds without runaway console output.
4. Confirm resizing the viewport does not stretch, clip, or permanently blur the canvas.

### Context loss and recovery

1. Trigger `WEBGL_lose_context` when supported.
2. Confirm the page exposes a non-destructive fallback state.
3. Restore the context.
4. Confirm rendering resumes without reloading the entire application.

### Navigation and cleanup

1. Open and close the inspection drawer repeatedly.
2. Switch families repeatedly.
3. Navigate away and back when a route is available.
4. Confirm animation frames, event listeners, WebGL resources, and canvases are not duplicated.

### Performance observation

Record, but do not enforce as an automated pass/fail threshold in this PR:

- approximate steady-state frame rate
- main-thread long tasks
- GPU or memory growth over 60 seconds
- mobile thermal or battery warnings

## Evidence

Retain:

- a screenshot of the initial rendered state
- a screenshot of the fallback state
- console export with no unexplained errors
- environment metadata
- pass/fail notes for every check

## Failure rule

Any blank canvas, unhandled shader error, unrecoverable context loss, duplicated renderer, or inaccessible control blocks approval. Performance observations become follow-up issues unless they make the interface unusable.
