
#!/usr/bin/env node

// Run the Vite installation script and then start the dev server
const { spawnSync, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log current working directory for debugging
console.log('Current working directory:', process.cwd());

// First ensure Vite is installed
require('./src/utils/install-vite.js');

// Now start the dev server using the existing start-dev.js script
console.log('Starting development server...');
try {
  // Make the script executable first if needed
  if (process.platform !== 'win32') {
    try {
      fs.chmodSync('./start-dev.js', '755');
    } catch (err) {
      console.warn('Could not change start-dev.js permissions:', err.message);
    }
  }
  
  // Run the start-dev script
  const result = spawnSync('node', ['./start-dev.js'], {
    stdio: 'inherit',
    shell: true
  });
  
  process.exit(result.status);
} catch (error) {
  console.error('Failed to start development server:', error.message);
  
  // Fallback to direct npx vite execution
  console.log('Attempting to start with npx vite directly...');
  try {
    execSync('npx vite', { stdio: 'inherit' });
  } catch (fallbackError) {
    console.error('All attempts to start dev server failed.');
    process.exit(1);
  }
}
