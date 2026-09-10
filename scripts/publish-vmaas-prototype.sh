#!/bin/bash
set -euo pipefail
REPO="/Users/yfrimanm/.cursor/Jira"
WT=$(mktemp -d)
trap 'git -C "$REPO" worktree remove "$WT" --force 2>/dev/null || rm -rf "$WT"' EXIT

cd "$REPO"
git fetch origin gh-pages
git worktree add "$WT" gh-pages
cp "$REPO/vmaas-ux-prototype.html" "$WT/vmaas-ux-prototype.html"
cd "$WT"
git add vmaas-ux-prototype.html
if git diff --cached --quiet; then
  echo "NO_CHANGES"
  exit 0
fi
git commit -m "Publish latest vmaas-ux-prototype catalog updates."
git push origin gh-pages
echo "PUBLISHED_OK"
