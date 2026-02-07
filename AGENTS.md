## Repo-specific operating notes (hwpkit)

### Working attitude (keep this)
- Be conservative about repo hygiene, but proactive in execution.
- Prefer small, verifiable changes over big-bang rewrites.
- After each meaningful edit, run the closest relevant build/test before moving on.
- Preserve history unless explicitly asked to squash/rewrite.
- If uncertain, choose reversible operations first.

### Local workflow conventions in this repo (keep this)
- For ad-hoc scripts/tests, use this repo’s `tmp/` directory.
  - `tmp/` is intentionally gitignored for disposable helpers.
  - Remove one-off files after use when they are no longer needed.
- When generating sample files, always verify output path is inside this repo.
  - Prefer explicit absolute targets under `samples/` to avoid writing to sibling folders.

### Package manager / workspace policy
- Package manager is pnpm.
  - Keep `pnpm-workspace.yaml` as workspace source of truth.
  - Do not reintroduce `yarn.lock` or `package-lock.json`.
- When `website` consumes local `hwpkit`, use `"hwpkit": "workspace:*"`.
  - Prevents pnpm store-package resolution and type/API drift.

### Build/test scope policy (current)
- Root scripts intentionally target stable paths:
  - `build`: `pnpm -C hwpkit build && pnpm -C hwpkit/automation build`
  - `test`: `pnpm -C hwpkit test && pnpm -C hwpkit/automation test`

### Package-specific notes
- `website` (Next 16): keep webpack mode for now (`next build --webpack`, `next dev --webpack`) until Turbopack migration is complete.
- `hwpkit` package: ESM output + ESM-based Vitest tests.
- `hwpkit/automation`:
  - Internal tooling package (Windows-first usage).
  - CLI surface removed; maintain library/test/codegen paths.
  - COM/E2E tests are env-gated (`HWP_AUTOMATION_E2E=1`) and skipped by default.
