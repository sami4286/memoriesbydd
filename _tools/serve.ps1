# Static preview server for _deploy/ — so the designs can be reviewed in VS Code.
#
# Why this exists: the pages use root-relative links (/order, /price-list). Opening
# them with file:// resolves those against the filesystem root, so the nav breaks
# and nothing links up. They need to be served over HTTP.
#
# There is no Node and no real Python on this machine (the `python` on PATH is the
# Windows Store stub), so this uses .NET's HttpListener directly.
#
# Extensionless URLs are supported: /order serves order.html, matching how Netlify
# behaves in production. That means the preview and the live site route the same way.
#
# Usage:   powershell -ExecutionPolicy Bypass -File _tools/serve.ps1
#          powershell -ExecutionPolicy Bypass -File _tools/serve.ps1 -Port 8080
# Then in VS Code: Ctrl+Shift+P -> "Simple Browser: Show" -> http://localhost:8080
# Stop with Ctrl+C.

param(
  [int]$Port = 8080,
  [string]$Root = ""
)

$ErrorActionPreference = 'Stop'
if (-not $Root) { $Root = Join-Path (Split-Path $PSScriptRoot -Parent) '_deploy' }
$Root = (Resolve-Path $Root).Path

$mime = @{
  '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'
  '.js'='application/javascript; charset=utf-8'; '.json'='application/json; charset=utf-8'
  '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.gif'='image/gif'
  '.webp'='image/webp'; '.avif'='image/avif'; '.svg'='image/svg+xml'
  '.woff'='font/woff'; '.woff2'='font/woff2'; '.ico'='image/x-icon'
  '.txt'='text/plain; charset=utf-8'; '.mp4'='video/mp4'; '.pdf'='application/pdf'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try { $listener.Start() }
catch { Write-Host "Could not bind port $Port. Try -Port 8081." -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "  Serving $Root" -ForegroundColor Green
Write-Host "  http://localhost:$Port/" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Pages:" -ForegroundColor Gray
Get-ChildItem $Root -Filter *.html | Sort-Object Name | ForEach-Object {
  $slug = if ($_.BaseName -eq 'index') { '' } else { $_.BaseName }
  Write-Host ("    http://localhost:$Port/" + $slug) -ForegroundColor Gray
}
Write-Host ""
Write-Host "  In VS Code: Ctrl+Shift+P -> Simple Browser: Show -> paste the URL" -ForegroundColor DarkGray
Write-Host "  Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request; $res = $ctx.Response

    $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
    if ($rel -eq '') { $rel = 'index.html' }

    # candidate resolution: exact file, then .html, then directory index
    $candidates = @($rel)
    if (-not [System.IO.Path]::GetExtension($rel)) {
      $candidates += "$rel.html"
      $candidates += (Join-Path $rel 'index.html')
    }

    $path = $null
    foreach ($c in $candidates) {
      $p = Join-Path $Root ($c -replace '/', '\')
      # containment check - never serve outside the root
      try { $full = [System.IO.Path]::GetFullPath($p) } catch { continue }
      if ($full.StartsWith($Root, [StringComparison]::OrdinalIgnoreCase) -and (Test-Path $full -PathType Leaf)) {
        $path = $full; break
      }
    }

    if ($path) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
      $res.Headers.Add('Cache-Control', 'no-store, must-revalidate')
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $code = 200
    } else {
      $res.StatusCode = 404
      $res.ContentType = 'text/html; charset=utf-8'
      $body = [System.Text.Encoding]::UTF8.GetBytes(
        "<h1 style='font:400 2rem Georgia,serif;color:#2a2a2a'>404</h1>" +
        "<p style='font:400 1rem system-ui;color:#5f5a54'>Not built yet: /$rel</p>")
      $res.ContentLength64 = $body.Length
      $res.OutputStream.Write($body, 0, $body.Length)
      $code = 404
    }
    $res.OutputStream.Close()
    $colour = if ($code -eq 200) { 'DarkGray' } else { 'DarkYellow' }
    Write-Host ("  {0}  {1}" -f $code, $req.Url.AbsolutePath) -ForegroundColor $colour
  } catch {
    # a dropped connection should never kill the server
  }
}
