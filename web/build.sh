#!/bin/bash
# Type-check, bundle the app into one HTML file, and publish it to ../docs for GitHub Pages.
# Images stay as separate files in ../docs/assets/img and are referenced by relative URL.
set -euo pipefail
cd "$(dirname "$0")"
BUNDLER="${BUNDLER:-$HOME/.claude/skills/synced/d60b85ae-6797-4cba-9426-18261a8d9942_00019011-8382-4c64-9629-2e800309beea/web-artifacts-builder/scripts/bundle-artifact.sh}"

pnpm exec tsc -b
bash "$BUNDLER"

# Head tags that must not go through the bundler (absolute URLs, structured data, pre-paint theme).
python3 - <<'PY'
html = open("bundle.html", encoding="utf-8").read()
head = open("head.html", encoding="utf-8").read()
# Parcel minifies away <head>, so insert right after the opening <html ...> tag (charset first).
at = html.index(">", html.index("<html")) + 1
open("../docs/index.html", "w", encoding="utf-8").write(html[:at] + '\n<meta charset="utf-8">\n' + head + html[at:])
PY
echo "Published to ../docs/index.html ($(du -h ../docs/index.html | cut -f1))"
