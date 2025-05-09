
#!/usr/bin/env node

// Script to ensure Vite is installed properly
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing Vite...');

// Ensure we're in the project root directory
const projectRoot = process.cwd();

// Define environment settings to avoid platform-specific rollup issues
process.env.ROLLUP_SKIP_NORMALIZE = 'true';
process.env.VITE_CJS_IGNORE_WARNING = 'true';

// First, try to create workarounds for the Rollup platform dependencies issue
try {
  require('./rollup-workaround').createDummyRollupPlatformFiles();
  console.log('Rollup workarounds applied successfully');
} catch (err) {
  console.warn('Could not set up Rollup workarounds:', err.message);
}

try {
  // Try to install vite and related packages
  execSync('npm install --no-save vite@4.5.1 @vitejs/plugin-react-swc@3.3.2', {
    stdio: 'inherit',
    env: {
      ...process.env,
      ROLLUP_SKIP_NORMALIZE: 'true',
      VITE_CJS_IGNORE_WARNING: 'true'
    }
  });
  
  console.log('Vite installed successfully');
} catch (error) {
  console.error('Error while installing Vite:', error.message);
  console.log('You may need to manually install Vite by running: npm install vite@4.5.1 @vitejs/plugin-react-swc@3.3.2');
  process.exit(1);
}

// Export success indication for other scripts that might import this
module.exports = { success: true };
