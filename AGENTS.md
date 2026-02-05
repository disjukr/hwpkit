
## Tooling note: Avoid PowerShell one-shot patch scripts

When editing source files on Windows via powershell -Command, avoid complex one-shot patch scripts (heredocs / many nested quotes / regex replace). They frequently break due to quoting/escaping/newline issues and can corrupt files.

Preferred approach:
- Make small, explicit edits (or use a Node .cjs script that reads/writes files with clear string replacements),
- Run tests after each small change.

