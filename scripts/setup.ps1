Write-Host "Installing dependencies..."
npm install
if ($LASTEXITCODE -ne 0) {
  Write-Host "npm install failed" -ForegroundColor Red
  exit $LASTEXITCODE
}
Write-Host "Copy .env.local.example to .env.local and edit values if needed."
Write-Host "Starting dev server..."
npm run dev
