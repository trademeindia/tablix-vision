
#!/usr/bin/env node

// Script to start the development server with workarounds for Rollup platform dependencies
const { spawn } = require('child_process');

console.log('Starting development server with Rollup platform dependency workarounds...');

// Set environment variables to avoid Rollup platform-specific issues
const env = {
  ...process.env,
  ROLLUP_SKIP_NORMALIZE: 'true',
  VITE_CJS_IGNORE_WARNING: 'true',
  NODE_OPTIONS: '--experimental-modules --no-warnings'
};

// Start Vite
const viteProcess = spawn(
  'npx',
  ['vite'],
  { stdio: 'inherit', shell: true, env }
);

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
