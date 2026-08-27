#!/usr/bin/env bash
# Assembles _deploy/*.html from _src/*.html plus the shared partials.
#
# Why this exists: thirteen static pages each needing an identical nav, footer
# and mobile bar. Hand-copying them guarantees drift the moment a nav item
# changes. Source of truth is _src/; _deploy/*.html for these pages is
# GENERATED OUTPUT and must not be hand-edited.
#
# Markers, each on its own line in the _src page:
#   <!--#nav-->     -> _src/partials/nav.html
#   <!--#footer-->  -> _src/partials/footer.html (includes the mobile bar)
#   <!--#active:slug--> sets the active nav item, then is stripped
#
# index.html and order.html are hand-maintained and NOT built from _src.
#
# Usage: bash _tools/build.sh
set -euo pipefail
cd "$(dirname "$0")/.."

NAV="_src/partials/nav.html"
FOOT="_src/partials/footer.html"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
built=0

for src in _src/*.html; do
  [ -e "$src" ] || continue
  out="_deploy/$(basename "$src")"

  active=$(sed -n 's/.*<!--#active:\([a-z-]*\)-->.*/\1/p' "$src" | head -1)

  # per-page nav with the active item marked
  if [ -n "$active" ]; then
    sed "s|class=\"nav_link\" data-nav=\"$active\"|class=\"nav_link is-active\" data-nav=\"$active\"|" "$NAV" > "$TMP/nav.html"
  else
    cp "$NAV" "$TMP/nav.html"
  fi

  sed -e "/<!--#nav-->/r $TMP/nav.html" -e "/<!--#nav-->/d" \
      -e "/<!--#footer-->/r $FOOT"      -e "/<!--#footer-->/d" \
      -e "/<!--#active:[a-z-]*-->/d" "$src" > "$out"

  echo "  built $out  ($(wc -c < "$out") bytes)"
  built=$((built+1))
done
echo "$built page(s) built"
