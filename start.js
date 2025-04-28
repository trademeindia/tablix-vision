
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting the application...');

// Execute ensure-executable first
try {
  require('./src/utils/ensure-executable');
} catch (error) {
  console.warn('Could not run ensure-executable:', error.message);
}

// Environment variables to avoid Rollup platform-specific issues
process.env.ROLLUP_SKIP_NORMALIZE = 'true';
process.env.VITE_CJS_IGNORE_WARNING = 'true';
process.env.NODE_OPTIONS = '--experimental-modules --no-warnings';

// Start the application
try {
  console.log('Starting with Rollup platform dependency workarounds...');
  execSync('npx vite', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      ROLLUP_SKIP_NORMALIZE: 'true',
      VITE_CJS_IGNORE_WARNING: 'true'
    }
  });
} catch (error) {
  console.error('Error starting application:', error.message);
  console.log('Please check the errors above and try again.');
  process.exit(1);
}
