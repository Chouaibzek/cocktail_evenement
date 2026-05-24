#!/usr/bin/env bash
set -euo pipefail

file=$(cat | jq -r '.tool_input.file_path // empty')

if [[ "$file" =~ \.(ts|tsx|js|jsx)$ ]]; then
  npx prettier --write "$file" 2>/dev/null
  npx eslint --fix "$file" 2>/dev/null
fi
