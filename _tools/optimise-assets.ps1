# Derives web-sized images in _deploy/img/designs/ from the raw originals in _assets/.
#
# Raw files run up to 2.5 MB each against a sub-1 MB page budget
# (_strategy/10-PERFORMANCE.md), so nothing in _assets/ ships directly.
#
# WHY IMAGEMAGICK: .NET's System.Drawing PNG encoder produced a 1041 KB file
# from an 815 KB source - larger than the original. ImageMagick writes the same
# image as WebP at 102 KB with the alpha channel intact. There is no WebP
# encoder in .NET or WIC on this machine, so ImageMagick is a hard requirement.
#   winget install ImageMagick.ImageMagick
#
# FORMATS - two per image, wired up with <picture>:
#   .webp  primary. Alpha-capable, ~10x smaller than PNG on cut-outs.
#   .jpg   fallback for the few browsers without WebP.
#          Cut-outs are FLATTENED ONTO THE TINTED PLATE COLOUR (--bg-plate,
#          #ece5d9) rather than white, because that is the ground the design
#          always shows them on. A white-flattened fallback would show a white
#          box on a cream plate.
#
# Consequence for CSS: cut-outs must NOT use mix-blend-mode:multiply. That hack
# only existed to sit white-background mockups on the tinted plate.
# DESIGN-NOTES.md anticipated this: "if any product art gets a true transparent
# background, drop the blend."
#
# ROLE DETECTION, from the filenames the client uses:
#   *package*, *comp*         -> wide package composite -> {slug}-package
#   *square5/6*, *sq4/5/6*    -> single upright cover   -> {slug}-cover
#   *square1/2/3*, *sq1/2/3*  -> two-page spread        -> {slug}-spread1..N
#   everything else                                    -> {slug}-g1..N
#   (the sqN convention was established by pixel-scanning in DESIGN-NOTES.md)
#
# Requires _assets/, which is gitignored - see .gitignore. Without it this exits
# quietly and leaves the already-derived files in _deploy/img/designs/ alone.
#
# Usage: powershell -ExecutionPolicy Bypass -File _tools/optimise-assets.ps1
#        -Only jamaica          one design
#        -Widths 1200,600       output widths
#        -Quality 82            WebP/JPEG quality

param(
  [string]$Only = '',
  [int[]]$Widths = @(1200, 600),
  [int]$Quality = 82,
  [string]$PlateColour = '#ece5d9',        # must match --bg-plate in css/site.css
  # Which roles to derive. Deriving all 247 originals at 2 widths x 2 formats
  # came to ~63 MB, which defeats keeping the repo light. The prototype only
  # needs a cover and a package composite per design; full galleries are derived
  # per-design with -Roles all when a design detail page needs them.
  [string[]]$Roles = @('cover','package'),
  # WebP only by default. Support is ~97% of browsers and this is a design
  # prototype - the Webflow build will handle its own asset pipeline. Pass
  # -Jpeg to emit fallbacks too.
  [switch]$Jpeg
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

# Invoked via `powershell -File`, a comma list arrives as ONE string rather than
# an array, which silently made every role fail the filter. Normalise both.
$Roles  = @($Roles  | ForEach-Object { $_ -split ',' } | ForEach-Object { $_.Trim() } | Where-Object { $_ })
$Widths = @($Widths | ForEach-Object { "$_" -split ',' } | ForEach-Object { [int]$_.Trim() })

# --- locate magick ---
# The installer does not add itself to PATH in an already-open shell, and a
# wildcard directory needs -Recurse for -Filter to match inside it.
$magick = (Get-Command magick -ErrorAction SilentlyContinue).Source
if (-not $magick) {
  $env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' +
              [Environment]::GetEnvironmentVariable('Path','User')
  $magick = (Get-Command magick -ErrorAction SilentlyContinue).Source
}
if (-not $magick) {
  foreach ($base in @($env:ProgramFiles, ${env:ProgramFiles(x86)})) {
    if (-not $base) { continue }
    $hit = Get-ChildItem "$base\ImageMagick*" -Filter magick.exe -Recurse -Depth 1 `
             -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($hit) { $magick = $hit.FullName; break }
  }
}
if (-not $magick) {
  Write-Host "  ImageMagick not found. Install it with:" -ForegroundColor Red
  Write-Host "    winget install ImageMagick.ImageMagick" -ForegroundColor Yellow
  exit 1
}

$srcRoot = Join-Path $root '_assets'
$outRoot = Join-Path $root '_deploy\img\designs'
if (-not (Test-Path $srcRoot)) {
  Write-Host "  _assets/ not present - nothing to derive. See .gitignore." -ForegroundColor Yellow
  exit 0
}
New-Item -ItemType Directory -Force -Path $outRoot | Out-Null

# Two naming conventions arrived in the drop and both have to be handled:
#   Caribbean + Football: the sqN / square-N convention, worked out by pixel
#     scanning in DESIGN-NOTES.md (sq1-3 = two-page spread, sq4-6 = upright cover)
#   Standard + Classic: plain English - "Rose Petals front.png", "Acrylic
#     Inside.png", "Clear Satin Banner.png"
# Order matters: banner/bookmark are checked first because "Rose Petals
# Bookmarker.png" would otherwise fall through to gallery.
function Get-Role([string]$name) {
  $n = [System.IO.Path]::GetFileNameWithoutExtension($name).ToLower()
  if ($n -match 'bookmark')                            { return 'bookmark' }
  if ($n -match 'banner')                              { return 'banner'   }
  if ($n -match 'package|pckage|paackage|comp|booklets|website-header') { return 'package' }
  if ($n -match '\bback\b')                            { return 'back'     }
  if ($n -match 'inside')                              { return 'spread'   }
  if ($n -match 'front|square5|square6|sq4|sq5|sq6')   { return 'cover'    }
  if ($n -match 'square1|square2|square3|sq1|sq2|sq3') { return 'spread'   }
  if ($n -match 'variation|colour|purple|black|grey|gray|green|teal|blue') { return 'colourway' }
  return 'gallery'
}

# Filenames alone left 19 designs with no cover, because the Caribbean and
# Football folders use a short form ("t5-1.jpg", not "tsquare5"). So anything the
# filename cannot classify gets MEASURED instead - trim to the subject's bounding
# box and read its aspect ratio. This is the method DESIGN-NOTES.md established
# by pixel-scanning: an upright single cover comes out near 0.74, a two-page
# spread near 1.19. Verified on antigua: t5-1 = 0.73, tsquare1 = 1.16.
function Get-RoleByShape([string]$path, [string]$magick) {
  $t = (& $magick "$path[0]" -fuzz 8% -trim -format '%wx%h' info: 2>$null)
  if (-not $t -or $t -notmatch '^(\d+)x(\d+)$') { return $null }
  $w = [double]$Matches[1]; $h = [double]$Matches[2]
  if ($h -le 0) { return $null }
  $r = $w / $h
  if ($r -lt 0.85) { return 'cover'  }   # taller than wide - single upright cover
  if ($r -gt 1.50) { return 'wide'   }   # bookmark or banner-shaped item
  return $null                            # 0.85-1.50 is ambiguous; leave as found
}

$rows = @(); $bytesIn = 0; $bytesOut = 0; $made = 0

$dirs = Get-ChildItem $srcRoot -Directory -Recurse -Depth 1 |
        Where-Object { $_.Parent.FullName -ne $srcRoot }
if ($Only) { $dirs = $dirs | Where-Object { $_.Name -eq $Only } }

foreach ($dir in $dirs) {
  $slug  = $dir.Name
  $range = $dir.Parent.Name
  $files = Get-ChildItem $dir.FullName -File | Where-Object { $_.Extension -match '(?i)\.(png|jpg|jpeg)$' }
  # Index EVERY role, not just gallery. Several designs have two files that map
  # to the same role (e.g. "Rose Petals front.png" and "Rose Petals Front2.png"),
  # and an un-indexed stem meant the second silently overwrote the first.
  $counters = @{}

  $kept = 0
  foreach ($f in $files | Sort-Object Name) {
    $role = Get-Role $f.Name
    # fall back to measuring the subject shape when the filename says nothing
    if ($role -eq 'gallery') {
      $byShape = Get-RoleByShape $f.FullName $magick
      if ($byShape -eq 'cover') { $role = 'cover' }
    }
    if (-not $counters.ContainsKey($role)) { $counters[$role] = 0 }
    $counters[$role]++
    $i = $counters[$role]
    $short = if ($role -eq 'gallery') { 'g' } else { $role }
    $stem = if ($i -eq 1) { "$slug-$short" } else { "$slug-$short$i" }
    if ($role -eq 'gallery') { $stem = "$slug-g$i" }

    if ($Roles -notcontains 'all' -and $Roles -notcontains $role) { continue }
    $kept++

    # Does it actually USE transparency? %[opaque] is the purpose-built property -
    # it returns False only when pixels are genuinely non-opaque. Checking the
    # channel list alone would wrongly flag 32bpp files whose alpha is all 255.
    $opaque   = (& $magick identify -format '%[opaque]' "$($f.FullName)[0]" 2>$null)
    $hasAlpha = ("$opaque".Trim() -eq 'False')

    $dim = (& $magick identify -format '%wx%h' "$($f.FullName)[0]" 2>$null)
    $bytesIn += $f.Length

    foreach ($w in $Widths) {
      $suffix = if ($w -eq $Widths[0]) { '' } else { "-$w" }

      $webp = Join-Path $outRoot "$stem$suffix.webp"
      & $magick $f.FullName -auto-orient -resize "${w}x>" -strip `
                -define webp:method=6 -quality $Quality $webp

      $outs = @($webp)
      if ($Jpeg) {
        $jpg = Join-Path $outRoot "$stem$suffix.jpg"
        if ($hasAlpha) {
          # flatten onto the plate colour, not white - see header note
          & $magick $f.FullName -auto-orient -resize "${w}x>" -strip `
                    -background $PlateColour -alpha remove -alpha off `
                    -interlace Plane -quality $Quality $jpg
        } else {
          & $magick $f.FullName -auto-orient -resize "${w}x>" -strip `
                    -interlace Plane -quality $Quality $jpg
        }
        $outs += $jpg
      }

      foreach ($o in $outs) { if (Test-Path $o) { $bytesOut += (Get-Item $o).Length; $made++ } }
    }

    $outDim = (& $magick identify -format '%wx%h' (Join-Path $outRoot "$stem.webp") 2>$null)
    $rows += [PSCustomObject]@{
      slug = $slug; range = $range; role = $role; transparent = $hasAlpha
      stem = $stem; source = $f.Name; sourceSize = $dim; webSize = $outDim
    }
  }
  $per = $Widths.Count * $(if ($Jpeg) { 2 } else { 1 })
  Write-Host ("  {0,-28} {1,2} of {2,2} source -> {3,2} derived" -f $slug, $kept, $files.Count, ($kept * $per))
}

Write-Host ""
Write-Host ("  files written : {0}" -f $made) -ForegroundColor Green
if ($made -eq 0) {
  Write-Host "  Nothing matched. Roles requested: $($Roles -join ', ')" -ForegroundColor Yellow
  Write-Host "  Valid roles: cover, package, spread, gallery, banner, bookmark, back, colourway, all" -ForegroundColor Yellow
  exit 1
}
Write-Host ("  source        : {0} MB" -f [math]::Round($bytesIn/1MB,1))
Write-Host ("  derived       : {0} MB   ({1}% of the sources used)" -f `
            [math]::Round($bytesOut/1MB,1), [math]::Round(100*$bytesOut/$bytesIn))
Write-Host ("  transparent   : {0} cut-outs (WebP keeps alpha, JPEG flattens to {1})" -f `
            @($rows | Where-Object { $_.transparent }).Count, $PlateColour)
Write-Host ("  opaque        : {0}" -f @($rows | Where-Object { -not $_.transparent }).Count)

$rows | Sort-Object range, slug, role, stem | ConvertTo-Json -Depth 4 |
  Set-Content (Join-Path $root '_archive\data\design-images.json') -Encoding UTF8
Write-Host ""
Write-Host "  manifest -> _archive/data/design-images.json" -ForegroundColor Cyan
