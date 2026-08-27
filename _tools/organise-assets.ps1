# One-off: reorganise the client's raw booklet asset drop into _assets/{range}/{slug}/
#
# The drop arrived as three Mac-zipped folders with inconsistent naming, a
# double-nested path in two of them, and __MACOSX/.DS_Store junk throughout.
# This maps every folder onto the design slugs already in
# _archive/data/designs.json so assets, copy and URLs all agree.
#
# Raw assets are KEPT and tracked. The last time source material was left
# untracked it went missing between machines. They live in _assets/ which is
# never published - Netlify serves _deploy/ only.
#
# Usage: powershell -ExecutionPolicy Bypass -File _tools/organise-assets.ps1
#        add -WhatIf to preview

param([switch]$WhatIf)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

# folder name as delivered  ->  range/slug used everywhere else
$map = [ordered]@{
  # --- Caribbean & African (double-nested in the zip) ---
  'AFRO CARIBBEAN BOOKLETS\AFRO CARIBBEAN BOOKLETS\Antigua'   = 'caribbean-african\antigua'
  'AFRO CARIBBEAN BOOKLETS\AFRO CARIBBEAN BOOKLETS\Barbados'  = 'caribbean-african\barbados'
  'AFRO CARIBBEAN BOOKLETS\AFRO CARIBBEAN BOOKLETS\Dominca'   = 'caribbean-african\dominica'   # typo in source
  'AFRO CARIBBEAN BOOKLETS\AFRO CARIBBEAN BOOKLETS\Ghana'     = 'caribbean-african\ghana'
  'AFRO CARIBBEAN BOOKLETS\AFRO CARIBBEAN BOOKLETS\Grenada'   = 'caribbean-african\grenada'
  'AFRO CARIBBEAN BOOKLETS\AFRO CARIBBEAN BOOKLETS\Jamaica'   = 'caribbean-african\jamaica'
  'AFRO CARIBBEAN BOOKLETS\AFRO CARIBBEAN BOOKLETS\Nigeria'   = 'caribbean-african\nigeria'
  'AFRO CARIBBEAN BOOKLETS\AFRO CARIBBEAN BOOKLETS\St Lucia'  = 'caribbean-african\st-lucia'
  'AFRO CARIBBEAN BOOKLETS\AFRO CARIBBEAN BOOKLETS\Trinidad'  = 'caribbean-african\trinidad'

  # --- Football ---
  'FOOTBALL BOOKLETS\FOOTBALL BOOKLETS\Arsenal'             = 'football\arsenal-f-c'
  'FOOTBALL BOOKLETS\FOOTBALL BOOKLETS\Chelsea'             = 'football\chelsea'
  'FOOTBALL BOOKLETS\FOOTBALL BOOKLETS\Liverpool'           = 'football\liverpool-f-c'
  'FOOTBALL BOOKLETS\FOOTBALL BOOKLETS\Man City'            = 'football\manchester-city-f-c'
  'FOOTBALL BOOKLETS\FOOTBALL BOOKLETS\Manchester City'     = 'football\manchester-city-f-c'   # merges - 3 files are byte-identical
  'FOOTBALL BOOKLETS\FOOTBALL BOOKLETS\Manchesteer United'  = 'football\manchester-united-f-c' # typo in source
  'FOOTBALL BOOKLETS\FOOTBALL BOOKLETS\Tottenham'           = 'football\tottenham-f-c-2'

  # --- Classic ---
  'STANDARD BOOKLETS NEW WEBSITE\Classics\Classic 1' = 'classic\classic-one'
  'STANDARD BOOKLETS NEW WEBSITE\Classics\Classic 2' = 'classic\classic-two'
  'STANDARD BOOKLETS NEW WEBSITE\Classics\Classic 3' = 'classic\classic-three'

  # --- Standard ---
  'STANDARD BOOKLETS NEW WEBSITE\Acrylic'           = 'standard\acrylic-splashes'
  'STANDARD BOOKLETS NEW WEBSITE\Amber Rose'        = 'standard\amber-rose'
  'STANDARD BOOKLETS NEW WEBSITE\Angel Wings'       = 'standard\angel-wings'
  'STANDARD BOOKLETS NEW WEBSITE\Black Beauty'      = 'standard\black-beauty'
  'STANDARD BOOKLETS NEW WEBSITE\Clear Satin'       = 'standard\clear-satin'
  'STANDARD BOOKLETS NEW WEBSITE\Cloudy Skies'      = 'standard\cloudy-skies'
  'STANDARD BOOKLETS NEW WEBSITE\Dominoe'           = 'standard\domino-effect'
  'STANDARD BOOKLETS NEW WEBSITE\Floral Wreath'     = 'standard\floral-wreath'
  'STANDARD BOOKLETS NEW WEBSITE\Godfather'         = 'standard\godfather'
  'STANDARD BOOKLETS NEW WEBSITE\Golden Ocean'      = 'standard\golden-ocean'
  'STANDARD BOOKLETS NEW WEBSITE\Holy Feather'      = 'standard\holy-feather'
  'STANDARD BOOKLETS NEW WEBSITE\Purple Rainforest' = 'standard\purple-rainforest'
  'STANDARD BOOKLETS NEW WEBSITE\Rasta Theme'       = 'standard\rasta-theme'
  'STANDARD BOOKLETS NEW WEBSITE\Rose Petals'       = 'standard\rose-petals'
  'STANDARD BOOKLETS NEW WEBSITE\She Loves FLowers' = 'standard\she-loves-flowers'
  'STANDARD BOOKLETS NEW WEBSITE\Snowflake'         = 'standard\snow-flake'
  'STANDARD BOOKLETS NEW WEBSITE\Victorian Colours' = 'standard\victorian-colours'
  'STANDARD BOOKLETS NEW WEBSITE\White Lillies'     = 'standard\white-lilies'   # misspelling in source
}

Write-Host ""
Write-Host "  Reorganising raw booklet assets" -ForegroundColor Cyan
Write-Host ""

$moved = 0; $skipped = 0; $collisions = @()

foreach ($src in $map.Keys) {
  $dstRel = $map[$src]
  if (-not (Test-Path $src)) { Write-Host "  MISSING  $src" -ForegroundColor DarkYellow; continue }
  $dst = Join-Path '_assets' $dstRel
  if (-not $WhatIf) { New-Item -ItemType Directory -Force -Path $dst | Out-Null }

  foreach ($f in Get-ChildItem $src -File) {
    if ($f.Name -eq '.DS_Store') { continue }
    $target = Join-Path $dst $f.Name
    if (Test-Path $target) {
      # merge case (Man City / Manchester City): keep one, record if they differ
      $same = (Get-FileHash $f.FullName).Hash -eq (Get-FileHash $target).Hash
      if ($same) { if (-not $WhatIf) { Remove-Item $f.FullName -Force }; $skipped++ }
      else { $collisions += "$($f.FullName) -> $target (DIFFERENT content, kept existing)"; $skipped++ }
      continue
    }
    if ($WhatIf) { Write-Host "  would move $($f.Name) -> $dstRel" -ForegroundColor DarkGray }
    else { Move-Item $f.FullName $target }
    $moved++
  }
}

Write-Host ""
Write-Host "  files moved   : $moved"     -ForegroundColor Green
Write-Host "  duplicates    : $skipped"   -ForegroundColor Gray
if ($collisions.Count) {
  Write-Host ""
  Write-Host "  NAME COLLISIONS with differing content - review these:" -ForegroundColor Yellow
  $collisions | ForEach-Object { Write-Host "    $_" -ForegroundColor Yellow }
}

if (-not $WhatIf) {
  # Mac zip junk
  foreach ($j in @('__MACOSX')) { if (Test-Path $j) { Remove-Item $j -Recurse -Force; Write-Host "  removed $j" -ForegroundColor Gray } }
  Get-ChildItem -Recurse -Force -Filter '.DS_Store' -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\\.git\\' } | Remove-Item -Force -ErrorAction SilentlyContinue

  # now-empty delivery folders
  foreach ($d in @('AFRO CARIBBEAN BOOKLETS','FOOTBALL BOOKLETS','STANDARD BOOKLETS NEW WEBSITE')) {
    if (Test-Path $d) {
      $left = Get-ChildItem $d -Recurse -File -Force -ErrorAction SilentlyContinue
      if (-not $left) { Remove-Item $d -Recurse -Force; Write-Host "  removed empty $d" -ForegroundColor Gray }
      else { Write-Host "  KEPT $d - still has $($left.Count) file(s):" -ForegroundColor Yellow
             $left | Select-Object -First 10 | ForEach-Object { Write-Host "      $($_.FullName -replace [regex]::Escape($root+'\'),'')" -ForegroundColor Yellow } }
    }
  }
}
Write-Host ""
