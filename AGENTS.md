## Repo-specific operating notes (hwpkit)

- Package manager policy in this repo is pnpm.
  - Keep `pnpm-workspace.yaml` as the workspace source of truth.
  - Do not reintroduce `yarn.lock` or `package-lock.json`.

- Workspace linking rule:
  - When `website` must consume local `hwpkit`, use `"hwpkit": "workspace:*"`.
  - Otherwise pnpm may resolve to a store package variant and cause type/API mismatch.

- Current root scripts intentionally scope build/test to stable targets:
  - `build`: `pnpm -C hwpkit build && pnpm -C hwpkit/automation build`
  - `test`: `pnpm -C hwpkit test && pnpm -C hwpkit/automation test`

- `website` is upgraded to Next 16 and currently relies on webpack mode.
  - Keep `next build --webpack` / `next dev --webpack` until Turbopack migration is done.

- `hwpkit` package output policy:
  - Library output is ESM (`"type": "module"`, TS module `esnext`).
  - Vitest tests are also ESM-based.

- `hwpkit/automation` policy:
  - Embedded internal tooling package (Windows-first usage).
  - CLI surface removed; keep maintenance focused on library/test/codegen paths.
  - COM/E2E tests are env-gated (`HWP_AUTOMATION_E2E=1`) and skipped by default.

- Samples path safety:
  - When generating samples via automation scripts, use explicit absolute output paths under this repo’s `samples/`.
  - Avoid ambiguous relative traversal that can write into sibling repos.
