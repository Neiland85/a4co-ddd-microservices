#!/usr/bin/env bash
set +e

# Safe wrapper for updating cSpell dictionaries from post-commit hook
# This script ensures the hook is non-blocking and gives helpful messages when deps are missing.

# Check if json5 is available
if ! node -e "require('json5')" 2>/dev/null; then
  echo "⚠️  Dictionary update skipped: json5 module not found"
  echo "   Run 'pnpm install' at the repository root to install dependencies"
  exit 0
fi

# Run the dictionary update (non-blocking). Avoid touching tracked markdown from the hook.
A4CO_UPDATE_DICTS_WRITE_MD=false pnpm run update:dicts >/dev/null 2>&1
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "⚠️  Dictionary update failed (non-blocking)"
  echo "   To diagnose:"
  echo "     1) Run 'pnpm install' at the repository root"
  echo "     2) Run 'pnpm run update:dicts' manually to see errors"
fi

# Always exit 0 so post-commit does not block commits
exit 0
