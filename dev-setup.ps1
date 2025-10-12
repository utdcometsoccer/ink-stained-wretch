# Development Setup Script
# This script updates dependencies, opens VS Code, launches browser, and runs development tasks

param(
    [switch]$SkipBrowser,
    [switch]$SkipVSCode,
    [string]$Port = "5173"
)

Write-Host "🚀 Starting development setup..." -ForegroundColor Green

# Set the script location as working directory
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptPath

Write-Host "📦 Updating npm packages..." -ForegroundColor Yellow
try {
    npm update
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm update failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ npm update completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Error during npm update: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Launch Visual Studio Code
if (-not $SkipVSCode) {
    Write-Host "💻 Opening Visual Studio Code..." -ForegroundColor Yellow
    try {
        Start-Process "code" -ArgumentList "." -NoNewWindow
        Write-Host "✅ Visual Studio Code launched" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Could not launch VS Code. Make sure 'code' is in your PATH" -ForegroundColor Yellow
    }
} else {
    Write-Host "⏭️ Skipping VS Code launch" -ForegroundColor Cyan
}

# Git fetch
Write-Host "📡 Fetching latest changes from git..." -ForegroundColor Yellow
try {
    git fetch
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ git fetch failed" -ForegroundColor Red
    } else {
        Write-Host "✅ git fetch completed successfully" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error during git fetch: $($_.Exception.Message)" -ForegroundColor Red
}

# Run tests (non-blocking)
Write-Host "🧪 Starting tests in background..." -ForegroundColor Yellow
try {
    $testJob = Start-Job -ScriptBlock {
        Set-Location $using:ScriptPath
        npm run test
    }
    Write-Host "✅ Tests started (Job ID: $($testJob.Id))" -ForegroundColor Green
    Write-Host "💡 Use 'Receive-Job $($testJob.Id)' to check test results later" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error starting tests: $($_.Exception.Message)" -ForegroundColor Red
}

# Open browser (before starting dev server)
if (-not $SkipBrowser) {
    Write-Host "🌐 Opening browser to http://localhost:$Port..." -ForegroundColor Yellow
    try {
        Start-Process "http://localhost:$Port"
        Write-Host "✅ Browser opened" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Could not open browser automatically" -ForegroundColor Yellow
    }
} else {
    Write-Host "⏭️ Skipping browser launch" -ForegroundColor Cyan
}

# Start development server (this will keep running)
Write-Host "🔥 Starting development server..." -ForegroundColor Yellow
Write-Host "📝 Note: Development server will continue running. Press Ctrl+C to stop." -ForegroundColor Cyan
Write-Host "🌐 Application will be available at: http://localhost:$Port" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White

try {
    npm run dev
} catch {
    Write-Host "❌ Error starting development server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}