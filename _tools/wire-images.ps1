# Repoints the built pages at the new high-resolution imagery.
#
# The pages were built against the old 600px assets in _deploy/img/. The client
# has since supplied originals 2-4.5x larger, now derived into
# _deploy/img/designs/ by optimise-assets.ps1.
#
# What this does per image:
#   - swaps the src to the derived WebP
#   - adds srcset (600w + 1200w) and sizes, so phones stop downloading desktop
#     pixels (10-PERFORMANCE.md)
#   - sets width/height to the real derived dimensions, so CLS stays fixed
#   - adds class="cutout" where the source is a true cut-out, because those must
#     not get mix-blend-mode:multiply
#
# Idempotent: run it again after re-deriving and it just rewrites the same tags.
#
# Usage: powershell -ExecutionPolicy Bypass -File _tools/wire-images.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

$manifest = Get-Content '_archive\data\design-images.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$byStem = @{}
foreach ($r in $manifest) { $byStem[$r.stem] = $r }

# old asset path  ->  new stem + the sizes attribute for where it appears
# sizes values come from the actual layout: 4-up plate grid, 3-up package grid,
# 2-up promise cards, half-width product rows.
$map = @(
  # --- homepage: range cards (4-up portrait plates) ---
  @{ old='img/single-caribbean.jpg'; stem='jamaica-cover';        sizes='(max-width:640px) 90vw, (max-width:1180px) 44vw, 22vw' }
  @{ old='img/single-classic.jpg';   stem='classic-one-cover';    sizes='(max-width:640px) 90vw, (max-width:1180px) 44vw, 22vw' }
  @{ old='img/single-football.jpg';  stem='arsenal-f-c-cover';    sizes='(max-width:640px) 90vw, (max-width:1180px) 44vw, 22vw' }
  @{ old='img/single-standard.jpg';  stem='white-lilies-cover';   sizes='(max-width:640px) 90vw, (max-width:1180px) 44vw, 22vw' }
  # --- homepage: spotlight mood + package tiers + promise cards ---
  @{ old='img/jamaica.png';          stem='jamaica-package';      sizes='(max-width:1180px) 60vw, 26vw' }
  @{ old='img/classic-one.png';      stem='classic-one-package';  sizes='(max-width:1180px) 60vw, 26vw' }
  @{ old='img/arsenal.png';          stem='arsenal-f-c-cover2';   sizes='(max-width:1180px) 60vw, 26vw' }
  @{ old='img/white-lilies.png';     stem='white-lilies-cover2';  sizes='(max-width:900px) 80vw, 30vw' }
  @{ old='img/black-beauty.png';     stem='black-beauty-package'; sizes='(max-width:900px) 90vw, 30vw' }
  @{ old='img/barbados.png';         stem='barbados-package';     sizes='(max-width:900px) 90vw, 30vw' }
  @{ old='img/godfather.png';        stem='godfather-cover';      sizes='(max-width:900px) 90vw, 30vw' }
  @{ old='img/angel-wings.png';      stem='angel-wings-package';  sizes='(max-width:900px) 80vw, 30vw' }
  @{ old='img/domino-effect.png';    stem='domino-effect-package';sizes='(max-width:900px) 80vw, 30vw' }
)

$targets = @('_deploy\index.html','_deploy\order.html') +
           (Get-ChildItem '_src' -Filter *.html | ForEach-Object { $_.FullName })

$totalSwaps = 0
foreach ($file in $targets) {
  if (-not (Test-Path $file)) { continue }
  $html = [System.IO.File]::ReadAllText($file)
  $before = $html
  $swaps = 0

  foreach ($e in $map) {
    if ($html -notmatch [regex]::Escape($e.old)) { continue }
    $row = $byStem[$e.stem]
    if (-not $row) { Write-Host "  !! no manifest row for $($e.stem)" -ForegroundColor Yellow; continue }
    if ($row.webSize -notmatch '^(\d+)x(\d+)$') { continue }
    $w = $Matches[1]; $h = $Matches[2]

    $cut = if ($row.transparent) { ' cutout' } else { '' }
    $newSrc = "img/designs/$($e.stem).webp"
    $srcset = "img/designs/$($e.stem)-600.webp 600w, img/designs/$($e.stem).webp ${w}w"

    # rewrite the whole <img> tag that carries this src, preserving alt/loading
    $rx = [regex]('<img\b(?<pre>[^>]*?)src="' + [regex]::Escape($e.old) + '"(?<post>[^>]*?)>')
    $html = $rx.Replace($html, {
      param($mm)
      $attrs = $mm.Groups['pre'].Value + $mm.Groups['post'].Value
      $alt = ([regex]::Match($attrs, 'alt="([^"]*)"')).Groups[1].Value
      $cls = ([regex]::Match($attrs, 'class="([^"]*)"')).Groups[1].Value
      $lazy = if ($attrs -match 'loading="lazy"') { ' loading="lazy"' } else { '' }
      $fp   = if ($attrs -match 'fetchpriority="high"') { ' fetchpriority="high"' } else { '' }
      $clsAttr = if ($cls -or $cut) { ' class="' + (($cls + $cut).Trim()) + '"' } else { '' }
      '<img src="' + $newSrc + '" srcset="' + $srcset + '" sizes="' + $e.sizes + '"' +
      ' alt="' + $alt + '" width="' + $w + '" height="' + $h + '"' + $clsAttr + $lazy + $fp +
      ' decoding="async">'
    })
    if ($html -ne $before) { $swaps++ }
  }

  if ($html -ne $before) {
    [System.IO.File]::WriteAllText($file, $html, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host ("  {0,-34} {1} image group(s) rewired" -f (Split-Path $file -Leaf), $swaps)
    $totalSwaps += $swaps
  }
}
Write-Host ""
Write-Host "  $totalSwaps rewired in total" -ForegroundColor Green
