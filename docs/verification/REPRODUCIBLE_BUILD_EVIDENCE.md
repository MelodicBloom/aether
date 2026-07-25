# AETHER Reproducible Build Evidence

Status: draft evidence gate  
Scope: build and verification infrastructure only

## Purpose

Verify the current Next.js application twice from one reviewed lockfile and record the WebGL evidence surface without changing shaders, uniforms, tokens, product behavior, deployment settings, or secrets.

## Consolidated topology

This branch starts from `feat/aether-runnable-gallery-v0`, which already contains:

- the runnable gallery previously delivered by PR #2;
- the reviewed `package-lock.json`;
- pinned ESLint dependencies and `.eslintrc.json`;
- the frozen-build repair verified in PR #3.

This branch adds only PR #7's reproducibility comparison and WebGL evidence inventory. It is the single promotion candidate to current `main`; overlapping lockfile, lint, and verification files must not be cherry-picked independently.

## Evidence sequence

```text
committed package.json + package-lock.json
→ lockfile SHA-256
→ npm ci
→ strict TypeScript
→ noninteractive lint
→ production build A
→ raw + narrowly normalized manifests A
→ clean production build B
→ raw + narrowly normalized manifests B
→ raw variance report
→ normalized comparison gate
→ WebGL evidence inventory
→ retained execution receipt
```

`generatedLockfile` must remain `false`. A missing lockfile is a blocking topology failure rather than permission for CI to mutate the branch.

## Raw versus normalized reproducibility

The workflow preserves two comparisons.

### Raw manifest

Regular output files are SHA-256 hashed without rewriting, excluding cache, `BUILD_ID`, and trace files. Raw differences remain evidence and are not described as byte-identical.

### Narrowly normalized manifest

`tests/normalize-next-build.mjs` may normalize only:

- the current Next `BUILD_ID` value and path segment;
- the absolute workspace path;
- `previewModeId`;
- `previewModeSigningKey`;
- `previewModeEncryptionKey`;
- `encryptionKey`;
- ordering of the `files` set in Next `.nft.json` trace manifests.

Unknown variance remains blocking. Any new normalization requires a reviewed documentation change.

Excluded files are:

- `.next/cache/**`;
- `.next/BUILD_ID`;
- `.next/trace` and `*.trace`.

## WebGL evidence classification

`tests/webgl-evidence.mjs` distinguishes:

- `proven`: a corresponding implementation signal is present;
- `missing`: a required baseline is absent and fails the job;
- `not-proven`: static inspection cannot establish behavior and a browser test is required.

Static inspection is never represented as runtime proof.

Runtime evidence still required under issue #9 includes:

- visible accessible fallback when WebGL is unavailable;
- context loss and restoration;
- shader-fetch cancellation;
- reduced-motion render-loop behavior;
- nonblank canvas browser smoke test;
- keyboard drawer behavior and focus return;
- canvas fallback semantics.

## Changed-file boundary

New evidence files in this branch:

```text
.github/workflows/reproducible-build.yml
docs/verification/REPRODUCIBLE_BUILD_EVIDENCE.md
tests/webgl-evidence.mjs
tests/normalize-next-build.mjs
```

Inherited repair files may appear in the promotion diff because they are not yet on `main`:

```text
package-lock.json
package.json
.eslintrc.json
.github/workflows/verify-aether-v0.yml
docs/verification/FROZEN_BUILD_REPAIR.md
```

No files under `src/**`, `public/shaders/**`, deployment configuration, visual tokens, or secrets may be changed by the consolidation work.

## Approval gate

Keep the promotion PR draft until:

- the committed lockfile is consumed without regeneration;
- frozen install, typecheck, lint, and both builds pass;
- narrowly normalized manifests match;
- raw variance remains retained as evidence;
- WebGL `not-proven` items remain explicit and issue-linked;
- the exact inherited-versus-new file inventory is reviewed;
- Jennipher approves promotion to `main`.

## Rollback

Close the promotion PR. Current `main` remains unchanged.
