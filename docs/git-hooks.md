# Git Hooks

This document describes the git hooks used in this repository, how they work, and how to troubleshoot them.

## Overview

- We use `simple-git-hooks` to manage git hooks via `package.json`.
- Hooks are installed automatically by running `pnpm install` (the `prepare` script runs `simple-git-hooks`).
- Hooks are configured in `package.json` under the `simple-git-hooks` key.

## Configured Hooks

### Post-commit hook

- Trigger: runs after every successful commit
- Script: `scripts/update-cspell-dicts.ts` executed via the safe wrapper
- Purpose: keep cSpell dictionaries in sync with repository terminology
- Configuration in `package.json`:

```json
"simple-git-hooks": {
  "post-commit": "bash scripts/update-dicts-safe.sh"
}
```

### Behavior

- The post-commit hook is intentionally non-blocking. The wrapper script `scripts/update-dicts-safe.sh` checks for required dependencies and prints helpful messages when the update is skipped.
- If the dictionary update fails, commits are not blocked and a warning is shown.

## Technical implementation

### TypeScript scripts

- Scripts inside `scripts/` use a dedicated TypeScript configuration file: `tsconfig.scripts.json`.
- `ts-node` is invoked with `--project tsconfig.scripts.json` to ensure proper module resolution for script execution.
- The `update:dicts` npm script in the repository root uses: `ts-node --project tsconfig.scripts.json scripts/update-cspell-dicts.ts`.

### Dependencies

- `json5` is required by the dictionary update script to parse VSCode-style JSON with comments.
- `ts-node` executes TypeScript scripts without pre-compilation.
- Keep hook-related dependencies in `devDependencies` so contributors get them via `pnpm install`.

### Safe wrapper

- `scripts/update-dicts-safe.sh` wraps the `pnpm run update:dicts` call and ensures it never exits non-zero when used as a hook.
- It checks for `json5` before running, prints actionable advice if dependencies are missing, and always exits with code 0 so commits are not blocked.

## Installation and setup

1. Clone the repository
2. Run `pnpm install` at the repository root
3. Verify hooks are installed: `ls -la .git/hooks/` (you should see `post-commit`)
4. If hooks are missing, run: `pnpm run prepare`

## Troubleshooting

### "Cannot find module 'json5'"

- Cause: devDependencies not installed or pnpm workspace issue
- Fix: run `pnpm install` at repository root

### Hook not running

- Cause: hooks not installed or disabled
- Fix: run `pnpm run prepare` to reinstall hooks

### Permission errors writing VSCode settings

- Cause: the script attempts to write into user VSCode settings and may be blocked by OS permissions.
- Fix: run the script manually or grant the required write permissions; alternatively operate only on the workspace file (`.vscode/settings.json`).

## Disabling hooks

- Temporarily: use `git commit --no-verify`
- Permanently: remove the entry from `package.json` under `simple-git-hooks`

## Migration notes

- The repository still contains a `.husky/` directory (legacy). Consider consolidating to `simple-git-hooks` and removing `.husky/` for consistency.

## Customization

- Adding new words to the project dictionary:
  - Edit `scripts/update-cspell-dicts.ts` and add words to `userDict` (global) or `workspaceDict` (project-only).
  - Run `pnpm run update:dicts` to apply changes manually.

- Changing the VSCode settings file location:
  - The script reads the user VSCode settings from a platform-specific path (macOS by default). If your environment stores VSCode settings in a different location, update the `userPath` constant at the top of `scripts/update-cspell-dicts.ts`.

## Best practices

- Keep hook scripts lightweight and non-blocking. Post-commit hooks should be informational and not prevent commits.
- Keep hook dependencies in `devDependencies` so `pnpm install` at repo root installs them for contributors.
- Document any platform-specific behavior (paths, permissions) so contributors on Linux/Windows can adapt easily.
- Test hooks in a clean environment (fresh clone + `pnpm install`) periodically or via CI.

## VSCode settings paths (cross-platform note)

The dictionary update script writes to or reads from VSCode settings files. Default paths used in `scripts/update-cspell-dicts.ts` are:

- macOS (default):
  - User settings: `~/Library/Application Support/Code/User/settings.json`
- Linux (example):
  - User settings: `~/.config/Code/User/settings.json`
- Windows (example):
  - User settings: `%APPDATA%\\Code\\User\\settings.json`

If you're running on Linux or Windows, please update the `userPath` constant in `scripts/update-cspell-dicts.ts` to the appropriate path for your environment before running the update script. The workspace settings path (`.vscode/settings.json`) is platform-independent within the repository.

### Quick note (cross-platform)

The script defaults to the macOS path. If you are on Linux or Windows and want the script to modify your user settings automatically, edit the `userPath` constant in `scripts/update-cspell-dicts.ts` to one of the platform paths above.
