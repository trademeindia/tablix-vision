
#!/usr/bin/env node

// This script starts the development server with workarounds for Rollup platform-specific dependencies
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting development server with Rollup platform dependency workarounds...');
console.log('Current working directory:', process.cwd());

// Create a function to make scripts executable (Unix only)
function makeExecutable(filePath) {
  try {
    if (process.platform !== 'win32') {
      fs.chmodSync(filePath, '755');
      console.log(`Made ${filePath} executable`);
    }
  } catch (err) {
    console.warn(`Warning: Could not make ${filePath} executable:`, err.message);
  }
}

// Make this script executable
makeExecutable(__filename);

// Start Vite with Node directly to avoid Rollup platform-specific issues
const viteProcess = spawn(
  'node', 
  ['node_modules/vite/bin/vite.js'], 
  { 
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      ROLLUP_SKIP_NORMALIZE: 'true', // Try to skip some rollup normalizations
      VITE_CJS_IGNORE_WARNING: 'true' // Reduce some CJS warnings
    }
  }
);

viteProcess.on('error', (err) => {
  console.error('Failed to start Vite:', err.message);
  
  // Fallback to npx
  console.log('Attempting fallback to npx vite...');
  const npxProcess = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });
  
  npxProcess.on('error', (npxErr) => {
    console.error('Fallback also failed:', npxErr.message);
    process.exit(1);
  });
});

viteProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`Vite process exited with code ${code}`);
  }
  process.exit(code);
});
