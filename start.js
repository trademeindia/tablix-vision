
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

// Advanced error handling for Rollup
process.on('uncaughtException', (error) => {
  if (error.message && error.message.includes('rollup') && error.message.includes('Cannot find module')) {
    console.error('Encountered Rollup platform dependency error. Attempting fallback...');
    
    try {
      // Try running with Node directly
      execSync('node node_modules/vite/bin/vite.js', { 
        stdio: 'inherit',
        env: {
          ...process.env,
          ROLLUP_SKIP_NORMALIZE: 'true',
          VITE_CJS_IGNORE_WARNING: 'true'
        }
      });
      return;
    } catch (fallbackError) {
      console.error('Fallback attempt failed:', fallbackError.message);
    }
  }
  
  console.error('Uncaught exception:', error);
  process.exit(1);
});

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
  console.error('Error starting application with npx vite:', error.message);
  
  try {
    console.log('Attempting fallback to direct Node execution...');
    execSync('node node_modules/vite/bin/vite.js', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        ROLLUP_SKIP_NORMALIZE: 'true',
        VITE_CJS_IGNORE_WARNING: 'true'
      }
    });
  } catch (fallbackError) {
    console.error('Fallback also failed:', fallbackError.message);
    console.log('Please check the errors above and try again.');
    process.exit(1);
  }
}
