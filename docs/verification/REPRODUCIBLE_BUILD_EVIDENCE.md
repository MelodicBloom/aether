# AETHER Reproducible Build Evidence

Status: draft evidence gate  
Scope: build and verification infrastructure only

## Purpose

Verify the current Next.js application twice from one reviewed lockfile and record the WebGL evidence surface without changing shaders, uniforms, tokens, product behavior, deployment settings, or secrets.

## Stack topology

This evidence PR is based on `feat/aether-runnable-gallery-v0`.

- PR #2 previously delivered the runnable gallery to `main`.
- PR #3 later merged the reviewed `package-lock.json`, pinned ESLint dependencies, `.eslintrc.json`, and frozen-build repair onto the retained runnable-gallery branch.
- PR #7 consumes that repaired branch and adds raw-versus-normalized reproducibility evidence plus the WebGL evidence inventory.

After PR #7 is approved, the repaired branch must be promoted to current `main` through one bounded PR. Do not independently cherry-pick overlapping lockfile, lint, or workflow files.

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

The workflow may generate a lockfile candidate only when a target branch lacks one. On the repaired stack, `generatedLockfile` must be `false`; regeneration is a blocking topology error.

## Raw versus normalized reproducibility

The workflow preserves two comparisons.

### Raw manifest

Regular output files are SHA-256 hashed without rewriting, excluding cache, `BUILD_ID`, and trace files. Raw differences remain evidence and are not described as byte-identical.

Next.js may introduce build-specific values including generated build IDs, preview-mode credentials, server-action encryption keys, and trace-manifest file ordering.

### Narrowly normalized manifest

`tests/normalize-next-build.mjs` may normalize only:

- the current Next `BUILD_ID` value and its path segment;
- the absolute workspace path;
- `previewModeId`;
- `previewModeSigningKey`;
- `previewModeEncryptionKey`;
- `encryptionKey`;
- ordering of the `files` set in Next `.nft.json` trace manifests.

It canonicalizes JSON key order and leaves all other content and binary files unchanged. Unknown variance remains blocking. Any additional normalization requires a reviewed documentation change.

Excluded files are:

- `.next/cache/**`;
- `.next/BUILD_ID`;
- `.next/trace` and `*.trace`.

## Lint evidence

The repaired base branch supplies a committed, noninteractive ESLint configuration compatible with the pinned Next.js toolchain. This PR does not alter lint policy or dependency versions.

A passing evidence run must demonstrate:

```text
npm ci
npm run typecheck
npm run lint
npm run build
```

If lint becomes interactive, regenerates configuration, or changes dependency resolution, the gate fails and the repair must remain in a separate bounded configuration PR.

## WebGL evidence classification

`tests/webgl-evidence.mjs` distinguishes:

- `proven`: a corresponding implementation signal is present;
- `missing`: a required baseline is absent and fails the job;
- `not-proven`: static inspection cannot establish behavior and a browser test is required.

Static inspection is never represented as runtime proof.

## Runtime evidence still required

- visible, accessible WebGL-unavailable fallback;
- context loss and restoration;
- shader-fetch cancellation;
- reduced-motion render-loop behavior;
- nonblank canvas browser smoke test;
- keyboard drawer behavior and focus return;
- canvas fallback semantics.

Current source inspection may prove implementation signals such as a client boundary, animation-frame cleanup, explicit GPU resource deletion, and a canvas accessible name. Runtime behavior remains owned by issue #9.

## Changed-file boundary

Allowed:

```text
.github/workflows/reproducible-build.yml
docs/verification/REPRODUCIBLE_BUILD_EVIDENCE.md
tests/webgl-evidence.mjs
tests/normalize-next-build.mjs
```

Forbidden:

```text
src/**
public/shaders/**
package.json
package-lock.json
.eslintrc.json
visual tokens
deployment files
secrets
```

The forbidden lockfile and lint files are inherited from the repaired base and must not be rewritten in this evidence PR.

## Approval gate

Keep the PR draft until:

- the committed lockfile is consumed without regeneration;
- frozen install, typecheck, lint, and both builds pass;
- narrowly normalized manifests match;
- raw variance remains retained as evidence;
- WebGL `not-proven` items remain explicit and issue-linked;
- Jennipher approves the exact evidence-only inventory.

## Rollback

Close the PR. Product behavior and dependency configuration remain unchanged by this branch.
