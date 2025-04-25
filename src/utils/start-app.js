
#!/usr/bin/env node

// This script starts the development or build process with workarounds for Rollup platform dependencies
const { spawn } = require('child_process');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting application with Rollup platform dependency workarounds...');

// Ensure the script is executable
if (process.platform !== 'win32') {
  try {
    fs.chmodSync(__filename, '755');
    console.log('Made this script executable');
  } catch (err) {
    console.warn('Warning: Could not make script executable:', err.message);
  }
}

// Determine which command to run based on the arguments
const args = process.argv.slice(2);
const command = args.length > 0 ? args[0] : 'dev';

// Start Vite with environment variables to avoid Rollup platform-specific issues
const env = {
  ...process.env,
  ROLLUP_SKIP_NORMALIZE: 'true', // Skip some rollup normalizations
  VITE_CJS_IGNORE_WARNING: 'true', // Reduce CJS warnings
};

let viteProcess;
if (command === 'build') {
  console.log('Building project...');
  viteProcess = spawn(
    'npx',
    ['vite', 'build'],
    { stdio: 'inherit', shell: true, env }
  );
} else if (command === 'preview') {
  console.log('Starting preview server...');
  viteProcess = spawn(
    'npx',
    ['vite', 'preview'],
    { stdio: 'inherit', shell: true, env }
  );
} else {
  console.log('Starting development server...');
  viteProcess = spawn(
    'npx',
    ['vite'],
    { stdio: 'inherit', shell: true, env }
  );
}

viteProcess.on('error', (err) => {
  console.error('Failed to start Vite:', err.message);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`Vite process exited with code ${code}`);
  }
  process.exit(code);
});
