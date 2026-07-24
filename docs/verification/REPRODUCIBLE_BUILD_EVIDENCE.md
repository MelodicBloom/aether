# AETHER Reproducible Build Evidence

Status: draft evidence gate
Scope: build and verification infrastructure only

## Purpose

Establish an honest frozen dependency resolution, verify the current Next.js application twice from the same lockfile, and record the WebGL evidence surface without changing shaders, uniforms, tokens, product behavior, deployment settings, or secrets.

## Evidence sequence

```text
package.json
→ generated package-lock.json candidate
→ lockfile SHA-256
→ npm ci
→ strict TypeScript
→ captured lint result
→ production build A
→ raw + narrowly normalized manifests A
→ clean production build B
→ raw + narrowly normalized manifests B
→ raw variance report
→ normalized comparison gate
→ WebGL evidence inventory
→ retained artifact receipt
```

## Lockfile policy

The workflow initially generates `package-lock.json` from the exact committed `package.json` using the public npm registry. The candidate lockfile is retained as an artifact for review.

It is not canonical until:

1. dependency resolution succeeds;
2. `npm ci` succeeds using that candidate;
3. typecheck and both production builds succeed;
4. lint has a noninteractive, reviewed configuration;
5. the narrowly normalized build manifests match;
6. the lockfile is reviewed and committed in a lockfile-only commit;
7. a later workflow run uses the committed lockfile without regeneration.

## Raw versus normalized reproducibility

The workflow preserves two separate comparisons.

### Raw manifest

Every regular output file except cache, `BUILD_ID`, and trace files is SHA-256 hashed without rewriting. Raw differences are retained as evidence and are not treated as identical.

Next.js currently introduces build-specific values including generated build IDs, preview-mode credentials, and server-action encryption keys. Raw output may therefore differ even when source and dependencies are unchanged.

### Narrowly normalized manifest

`tests/normalize-next-build.mjs` normalizes only declared framework/runtime variance:

- the current Next `BUILD_ID` value and its path segment;
- the absolute workspace path;
- `previewModeId`;
- `previewModeSigningKey`;
- `previewModeEncryptionKey`;
- `encryptionKey`.

It canonicalizes JSON key order and leaves all other content and binary files unchanged. The normalized manifest is the reproducibility gate. Any additional normalization requires a reviewed documentation change; unknown variance must not be hidden.

Excluded files are:

- `.next/cache/**`;
- `.next/BUILD_ID`;
- `.next/trace` and `*.trace`.

## Lint evidence

The current `next lint` command opens an interactive configuration prompt because the repository has no committed ESLint configuration. The workflow records the prompt and exit status, continues gathering build evidence, and fails at the final gate.

A separate bounded remediation must define ESLint configuration and any required development dependencies. This evidence PR does not change `package.json` or silently choose a lint profile.

## WebGL evidence classification

`tests/webgl-evidence.mjs` distinguishes:

- `proven`: a corresponding implementation signal is present;
- `missing`: a required baseline is absent and fails the job;
- `not-proven`: source inspection cannot establish the behavior and a browser test or remediation issue is required.

Static inspection is not represented as runtime proof.

## Known runtime evidence still required

- WebGL-unavailable visible fallback;
- context loss and restoration;
- shader-fetch cancellation;
- reduced-motion render-loop behavior;
- nonblank canvas browser smoke test;
- keyboard drawer behavior and focus return;
- canvas fallback semantics.

Current source inspection does prove a client boundary, animation-frame cleanup, explicit GPU resource-deletion calls, and a canvas accessible name. Runtime tests remain necessary.

These gaps do not authorize source changes in this PR. Each must become a separate bounded issue after the build contract is stable.

## Changed-file boundary

Allowed:

```text
.github/workflows/reproducible-build.yml
docs/verification/REPRODUCIBLE_BUILD_EVIDENCE.md
tests/webgl-evidence.mjs
tests/normalize-next-build.mjs
package-lock.json  # only after artifact review
```

Forbidden:

```text
src/**
public/shaders/**
package.json
visual tokens
deployment files
secrets
```

## Approval gate

Keep the PR draft until:

- a committed lockfile is used by `npm ci`;
- strict typecheck and both builds pass;
- narrowly normalized manifests match;
- lint is noninteractive and passes;
- WebGL `not-proven` items are filed as explicit remediation issues;
- Jennipher approves the exact evidence-only inventory.

## Rollback

Close the PR. No product or dependency-manifest behavior is changed until the lockfile and separate lint remediation are reviewed.
