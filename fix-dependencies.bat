@echo off
echo Menu360 Dependency Recovery Tool
echo ===============================
echo.

rem Clean up node_modules and lock files
echo Step 1: Cleaning up existing node_modules and lock files...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f package-lock.json
if exist yarn.lock del /f yarn.lock
if exist pnpm-lock.yaml del /f pnpm-lock.yaml
if exist bun.lockb del /f bun.lockb

rem Try to reinstall
echo.
echo Step 2: Installing dependencies with npm...
call npm install

rem Check if the install succeeded
if %ERRORLEVEL% == 0 (
  echo.
  echo ✅ Dependencies installed successfully!
  echo.
  echo You can now start the development server with:
  echo    npm run dev
) else (
  echo.
  echo ❌ Dependency installation failed. Trying minimal recovery...
  
  rem Backup current package.json
  echo.
  echo Step 3: Backing up current package.json...
  copy package.json package.json.full
  
  rem Use the minimal package.json
  echo.
  echo Step 4: Using minimal package.json...
  copy package.json.bak package.json
  
  rem Try to install minimal dependencies
  echo.
  echo Step 5: Installing minimal dependencies...
  call npm install
  
  if %ERRORLEVEL% == 0 (
    echo.
    echo ✅ Minimal dependencies installed successfully!
    echo.
    echo You can now start the development server with:
    echo    npm run dev
    echo.
    echo Note: This is running with minimal dependencies.
    echo       Your original package.json was saved as package.json.full
  ) else (
    echo.
    echo ❌ Even minimal dependency installation failed.
    echo    Please try running npm install manually or contact support.
    
    rem Restore original package.json
    copy package.json.full package.json
  )
)

echo.
echo Process complete.
pause 