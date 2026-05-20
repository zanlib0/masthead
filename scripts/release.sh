#!/usr/bin/env bash
set -euo pipefail

# Verify clean working tree
if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: working tree not clean" >&2
  exit 1
fi

# Lint + build
npm run lint
npm run build

# Prompt for version
current=$(node -p "require('./package.json').version")
echo "current version: $current"
read -p "new version (without 'v'): " new

# Bump, commit, tag, push
npm version "$new" --no-git-tag-version
git add package.json dist/
git commit -m "release v$new"
git tag "v$new"
git push origin main "v$new"

echo "released v$new"
echo "CDN URL: https://cdn.jsdelivr.net/gh/zanlib/masthead@v$new/dist/masthead.min.css"
