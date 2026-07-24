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
→ lint
→ production build A
→ normalized file manifest A
→ clean production build B
→ normalized file manifest B
→ manifest comparison
→ WebGL evidence inventory
→ retained artifact receipt
```

## Lockfile policy

The workflow initially generates `package-lock.json` from the exact committed `package.json` using the public npm registry. The candidate lockfile is retained as an artifact for review.

It is not canonical until:

1. dependency resolution succeeds;
2. `npm ci` succeeds using that candidate;
3. typecheck, lint, and both production builds succeed;
4. the normalized build manifests match;
5. the lockfile is reviewed and committed in a lockfile-only commit;
6. a later workflow run uses the committed lockfile without regeneration.

## Build-manifest normalization

The comparison excludes:

- `.next/cache/**`;
- `.next/BUILD_ID`;
- trace files whose content contains environment-specific absolute paths.

All remaining regular files are sorted and hashed with SHA-256. A mismatch blocks reproducibility approval and the differing files must be reported rather than normalized away casually.

## WebGL evidence classification

`tests/webgl-evidence.mjs` distinguishes:

- `proven`: a corresponding implementation signal is present;
- `missing`: a required baseline is absent and fails the job;
- `not-proven`: source inspection cannot establish the behavior and a browser test or remediation issue is required.

Static inspection is not represented as runtime proof.

## Known runtime evidence still required

- WebGL-unavailable visible fallback;
- context loss and restoration;
- shader, buffer, and program disposal;
- shader-fetch cancellation;
- reduced-motion render-loop behavior;
- nonblank canvas browser smoke test;
- keyboard drawer behavior and focus return;
- canvas fallback semantics.

These gaps do not authorize source changes in this PR. Each must become a separate bounded issue after the build contract is stable.

## Changed-file boundary

Allowed:

```text
.github/workflows/reproducible-build.yml
docs/verification/REPRODUCIBLE_BUILD_EVIDENCE.md
tests/webgl-evidence.mjs
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

Keep the PR draft until a committed lockfile is used by `npm ci` and the two normalized build manifests match on the same commit. WebGL `not-proven` items must be filed as explicit remediation issues before the verification PRs can merge.

## Rollback

Close the PR. No product or dependency manifest behavior is changed until the lockfile is separately reviewed and committed.
