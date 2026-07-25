# AETHER frozen build repair receipt

Status: repaired on the stacked `chore/verify-aether-v0` branch.

## Root causes

1. `package-lock.json` was absent, so `npm ci` correctly refused to run.
2. `package.json` declared `next lint`, but ESLint and a deterministic Next configuration were absent.

## Bounded repair

- generated `package-lock.json` from the pinned application manifest without running package scripts;
- validated the generated dependency tree with `npm ci --ignore-scripts --no-audit --no-fund`;
- added pinned `eslint@8.57.1` and `eslint-config-next@14.2.31`;
- added `.eslintrc.json` extending `next/core-web-vitals` and `next/typescript`;
- retained the existing source, shader, token, and product behavior;
- upgraded the verification workflow so a missing lockfile is committed only after frozen install, typecheck, lint, and production build all pass.

## Executed evidence

Workflow run `30105148254` completed successfully with:

- lockfile bootstrap: pass;
- frozen install: pass;
- TypeScript typecheck: pass;
- Next lint: pass;
- production build: pass;
- deterministic build archive and SHA-256 digest: pass;
- lockfile SHA-256 receipt: pass;
- retained workflow artifact: pass;
- verified lockfile commit: pass.

The next workflow run is intentionally triggered by this human-authored receipt so the same checks execute against the committed lockfile with no bootstrap mutation.

## Remaining manual gates

The frozen application build is repaired. WebGL context recovery, shader fallback, keyboard drawer behavior, focus return, reduced motion, canvas fallback, renderer cleanup, and viewport/accessibility checks remain manual evidence requirements documented elsewhere in this folder.
