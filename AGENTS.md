## Windows scripting + patching conventions

- Avoid complex one-shot patch scripts in `powershell -Command` (heredocs / heavy quoting / large regex replaces). They frequently break due to escaping/newline issues and can corrupt files.
- Prefer small, explicit edits (or a Node `.cjs` helper that reads/writes files with clear replacements), and run tests after each small change.
- If you need helper scripts, put them under the repo's `tmp/` directory (keep `tmp/` gitignored) so they can be re-run and iterated safely.

- Update TODO.md checkboxes when finishing a TODO section (easy to forget after code+tests+samples).

