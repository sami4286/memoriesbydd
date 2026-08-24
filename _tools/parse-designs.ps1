# Rebuilds _archive/data/designs.json from the raw REST API dump.
#
# Context: the original designs.json was lost between machines. The WordPress
# REST API on the live site is open, so _archive/raw/avada_portfolio.json can be
# re-fetched at any time and this script re-derives the structured file from it.
#
# The content is Avada Fusion Builder output: per-row <style> blocks, shortcodes
# and markup wrapped around a small amount of actual copy. Order matters -
# <style>/<script> bodies MUST be removed before tags are stripped, or you get
# several thousand characters of CSS selectors in your "description".
#
# Usage:  powershell _tools/parse-designs.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$raw  = Join-Path $root '_archive\raw\avada_portfolio.json'
$cats = Join-Path $root '_archive\raw\portfolio_category.json'
$out  = Join-Path $root '_archive\data\designs.json'
New-Item -ItemType Directory -Force -Path (Split-Path $out -Parent) | Out-Null

$catMap = @{}
(Get-Content $cats -Raw -Encoding UTF8 | ConvertFrom-Json) | ForEach-Object { $catMap[[string]$_.id] = $_.name }

# "World" is the CMS name; the new site leads with "Caribbean & African".
# 05-CLIENT-ACTIONS.md item 6 has this awaiting Ashley's sign-off.
$catRename = @{ 'World' = 'Caribbean & African'; 'football' = 'Football' }

function Clean-Text([string]$html) {
  if (-not $html) { return '' }
  $t = [regex]::Replace($html, '(?is)<style[^>]*>.*?</style>', ' ')
  $t = [regex]::Replace($t,   '(?is)<script[^>]*>.*?</script>', ' ')
  $t = [regex]::Replace($t,   '(?s)\[[^\]]*\]', ' ')          # fusion shortcodes
  $t = [regex]::Replace($t,   '(?s)<[^>]+>', ' ')
  $t = [System.Net.WebUtility]::HtmlDecode($t)
  $t = [regex]::Replace($t,   '\s+', ' ')
  return $t.Trim()
}

$results = foreach ($p in (Get-Content $raw -Raw -Encoding UTF8 | ConvertFrom-Json)) {

  $wpTitle = [System.Net.WebUtility]::HtmlDecode($p.title.rendered).Trim()
  # 38 of 40 have the button label "VIEW " leaked into the post title (audit C6)
  $name = ($wpTitle -replace '^(?i)VIEW\s+', '').Trim()
  $name = $name -replace '(?i)\bLILLIES\b', 'Lilies'          # audit C6 misspelling
  # Title Case the shouty CMS names, preserving F.C.
  $name = (Get-Culture).TextInfo.ToTitleCase($name.ToLower()) -replace '(?i)\bF\.c\.?', 'F.C.'

  $body = Clean-Text $p.content.rendered

  # Description sits between the design name and the SPECIFICATIONS block.
  $desc = ''
  $m = [regex]::Match($body, '(?is)^\s*' + [regex]::Escape($name) + '\s+(.*?)\s*SPECIFICATIONS')
  if ($m.Success) { $desc = $m.Groups[1].Value.Trim() }
  if (-not $desc) {
    $m2 = [regex]::Match($body, '(?is)(.*?)\s*SPECIFICATIONS')
    if ($m2.Success) { $desc = ($m2.Groups[1].Value -replace '(?i)^\s*' + [regex]::Escape($name), '').Trim() }
  }
  if (-not $desc) { $desc = (Clean-Text $p.excerpt.rendered) }

  function Spec([string]$pattern) {
    $r = [regex]::Match($body, $pattern)
    if ($r.Success) { return $r.Groups[1].Value.Trim(' ', ',', '.') } else { return $null }
  }

  # Product images: drop the -WxH responsive variants and the two dead
  # delivery-partner logos (dpd.png / uber.png - 404 sitewide, audit B1).
  $imgs = [regex]::Matches($p.content.rendered, 'wp-content/uploads/[^"'' )]+?\.(?:jpg|jpeg|png)') |
          ForEach-Object { ($_.Value -split '/')[-1] } |
          ForEach-Object { $_ -replace '-\d+x\d+(?=\.(?:jpg|jpeg|png)$)', '' } |
          Where-Object { $_ -notmatch '^(dpd|uber)\.png$' } |
          Sort-Object -Unique

  $vids = [regex]::Matches($p.content.rendered, 'vimeo\.com/(?:video/)?(\d+)') |
          ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

  $catNames = @($p.portfolio_category | ForEach-Object {
    $n = $catMap[[string]$_]; if ($catRename.ContainsKey($n)) { $catRename[$n] } else { $n } })

  [PSCustomObject]@{
    slug            = $p.slug
    name            = $name
    wp_title        = $wpTitle
    wp_id           = $p.id
    category        = if ($catNames.Count) { $catNames[0] } else { $null }
    old_url         = $p.link
    new_url         = "/booklets/$($p.slug)/"
    description     = $desc
    description_wc  = ($desc -split '\s+' | Where-Object { $_ }).Count
    size            = Spec '(?i)Size\s*&\s*Orientation\s+(A\d\s*[\d\sx]+mm)'
    photo_allowance = Spec '(?i)Photo Allowance\s+(.*?)\s+Suitability'
    suitability     = Spec '(?i)Suitability\s+(.*?)\s+\d+-\d+ Day'
    turnaround      = Spec '(?i)(\d+-\d+ Day Turnaround)'
    images          = @($imgs)
    image_count     = @($imgs).Count
    vimeo_ids       = @($vids)
    modified        = $p.modified
  }
}

$results | ConvertTo-Json -Depth 6 | Set-Content $out -Encoding UTF8
"Wrote $out  ($($results.Count) designs)"
