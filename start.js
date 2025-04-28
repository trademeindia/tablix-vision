
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

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
      const nodeProcess = spawn('node', ['node_modules/vite/bin/vite.js', '--force'], { 
        stdio: 'inherit',
        env: {
          ...process.env,
          ROLLUP_SKIP_NORMALIZE: 'true',
          VITE_CJS_IGNORE_WARNING: 'true'
        }
      });
      
      nodeProcess.on('close', (code) => {
        process.exit(code || 0);
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
  
  const viteProcess = spawn('npx', ['vite', '--force'], { 
    stdio: 'inherit',
    env: {
      ...process.env,
      ROLLUP_SKIP_NORMALIZE: 'true',
      VITE_CJS_IGNORE_WARNING: 'true',
      ROLLUP_WATCH_IGNORE: '@rollup/rollup-*'
    }
  });
  
  viteProcess.on('error', (err) => {
    console.error('Error starting application with npx vite:', err.message);
    
    console.log('Attempting fallback to direct Node execution...');
    const nodeProcess = spawn('node', ['node_modules/vite/bin/vite.js', '--force'], { 
      stdio: 'inherit',
      env: {
        ...process.env,
        ROLLUP_SKIP_NORMALIZE: 'true',
        VITE_CJS_IGNORE_WARNING: 'true',
        ROLLUP_WATCH_IGNORE: '@rollup/rollup-*'
      }
    });
    
    nodeProcess.on('error', (nodeErr) => {
      console.error('All fallbacks failed:', nodeErr.message);
      console.log('Please check the errors above and try again.');
      process.exit(1);
    });
  });
  
  viteProcess.on('close', (code) => {
    process.exit(code || 0);
  });
  
} catch (error) {
  console.error('Error starting application:', error.message);
  
  try {
    console.log('Attempting fallback to direct Node execution...');
    execSync('node node_modules/vite/bin/vite.js --force', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        ROLLUP_SKIP_NORMALIZE: 'true',
        VITE_CJS_IGNORE_WARNING: 'true',
        ROLLUP_WATCH_IGNORE: '@rollup/rollup-*'
      }
    });
  } catch (fallbackError) {
    console.error('Fallback also failed:', fallbackError.message);
    console.log('Please check the errors above and try again.');
    process.exit(1);
  }
}
