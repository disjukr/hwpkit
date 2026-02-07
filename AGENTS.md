## Windows scripting + patching conventions

- Avoid complex one-shot patch scripts in `powershell -Command` (heredocs / heavy quoting / large regex replaces). They frequently break due to escaping/newline issues and can corrupt files.
- Prefer small, explicit edits (or a Node `.cjs` helper that reads/writes files with clear replacements), and run tests after each small change.
- If you need helper scripts, put them under the repo's `tmp/` directory (keep `tmp/` gitignored) so they can be re-run and iterated safely.

- Update TODO.md checkboxes when finishing a TODO section (easy to forget after code+tests+samples).

- When writing patch scripts in Node, remember that strings like \\\tabDef\ or \\\readHwp5\ will become control characters (\\t, \\r, \\b, etc.). Use escaped backslashes (\\\\tabDef) or String.raw.

- On Windows nodes: prefer Git Bash (bash.exe -lc) over PowerShell for git/diff/grep/sed and general scripting to avoid encoding and quoting pitfalls.

## Recent learnings (2026-02)

- pnpm migration in this repo needs both:
  - `pnpm-workspace.yaml` (pnpm does not use `package.json#workspaces` directly)
  - removing legacy lockfiles (`yarn.lock`, `package-lock.json`) and keeping `pnpm-lock.yaml`.

- For local workspace linking, use `workspace:*` explicitly (e.g. `website -> hwpkit`).
  - Without this, pnpm can resolve to a store package variant and types/APIs may drift from local source.

- Next.js 16 defaults to Turbopack; if the project still has custom `webpack` config, use `next build --webpack` (and same for dev) until migrated.

- Vitest + ESM:
  - With `"type": "module"`, keep tests as ESM (`.mjs`/`import ...`) to avoid CommonJS `require('vitest')` failures.
  - Splitting one giant `it(...)` into focused test cases improves failure isolation and maintenance.

- When generating files from automation scripts, double-check resolved output paths on Windows.
  - `process.cwd()` + relative traversal can silently target sibling repos; prefer explicit absolute paths for important outputs.

- When embedding side projects into this repo, aggressively prune local-only artifacts before commit:
  - backups (`*.bak*`), tmp folders, archived snapshots, generated local artifacts.
