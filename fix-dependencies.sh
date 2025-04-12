#!/bin/bash

echo "Menu360 Dependency Recovery Tool"
echo "==============================="
echo ""

# Clean up node_modules and lock files
echo "Step 1: Cleaning up existing node_modules and lock files..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
rm -f pnpm-lock.yaml
rm -f bun.lockb

# Try to reinstall
echo ""
echo "Step 2: Installing dependencies with npm..."
npm install

# Check if the install succeeded
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Dependencies installed successfully!"
  echo ""
  echo "You can now start the development server with:"
  echo "   npm run dev"
else
  echo ""
  echo "❌ Dependency installation failed. Trying minimal recovery..."
  
  # Backup current package.json
  echo ""
  echo "Step 3: Backing up current package.json..."
  cp package.json package.json.full
  
  # Use the minimal package.json
  echo ""
  echo "Step 4: Using minimal package.json..."
  cp package.json.bak package.json
  
  # Try to install minimal dependencies
  echo ""
  echo "Step 5: Installing minimal dependencies..."
  npm install
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Minimal dependencies installed successfully!"
    echo ""
    echo "You can now start the development server with:"
    echo "   npm run dev"
    echo ""
    echo "Note: This is running with minimal dependencies." 
    echo "      Your original package.json was saved as package.json.full"
  else
    echo ""
    echo "❌ Even minimal dependency installation failed."
    echo "   Please try running npm install manually or contact support."
    
    # Restore original package.json
    cp package.json.full package.json
  fi
fi

echo ""
echo "Process complete." 