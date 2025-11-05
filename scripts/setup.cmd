@echo off
echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
  echo npm install failed
  pause
)
echo Copy .env.local.example to .env.local and edit values if needed.
echo Starting dev server...
npm run dev
