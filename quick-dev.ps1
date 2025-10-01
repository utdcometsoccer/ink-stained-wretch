# Quick Development Setup Script
# Simple version of dev-setup.ps1 without parameters

Write-Host "🚀 Quick development setup..." -ForegroundColor Green

# Update npm packages
Write-Host "📦 Updating npm packages..." -ForegroundColor Yellow
npm update

# Launch Visual Studio Code
Write-Host "💻 Opening Visual Studio Code..." -ForegroundColor Yellow
Start-Process "code" -ArgumentList "." -NoNewWindow

# Open browser
Write-Host "🌐 Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

# Git fetch
Write-Host "📡 Fetching from git..." -ForegroundColor Yellow
git fetch

# Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Yellow
npm run test

# Start dev server
Write-Host "🔥 Starting development server..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the dev server" -ForegroundColor Cyan
npm run dev