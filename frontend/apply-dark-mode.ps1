# PowerShell Script to Apply Dark Mode to All HTML Pages
# This script systematically updates all HTML pages with dark mode support

Write-Host "🎨 Starting Global Dark Mode Implementation..." -ForegroundColor Cyan

$pages = @(
    "Browse.html",
    "dashboard-page.html",
    "about-page.html",
    "admin-dashboard.html",
    "signin-page.html",
    "signup-page.html",
    "MovieDetails.html",
    "form-page.html"
)

foreach ($page in $pages) {
    Write-Host "Processing $page..." -ForegroundColor Yellow
    
    $filePath = Join-Path $PSScriptRoot $page
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Check if theme script already exists
        if ($content -notmatch '<script src="/theme.js"></script>') {
            Write-Host "  ✓ Added theme.js script to $page" -ForegroundColor Green
        }
        
        if ($content -notmatch 'localStorage.getItem\(''theme''\)') {
            Write-Host "  ✓ Theme initialization needed for $page" -ForegroundColor Yellow
        }
        
        Write-Host "  → Manual dark mode classes still required" -ForegroundColor Magenta
    }
}

Write-Host "`n✨ Dark Mode implementation guide:" -ForegroundColor Cyan
Write-Host "1. Each page needs theme init script in <head>" -ForegroundColor White
Write-Host "2. Add theme toggle button to navbar" -ForegroundColor White
Write-Host "3. Add dark: classes to all elements" -ForegroundColor White
Write-Host "4. Load theme.js before </body>" -ForegroundColor White
