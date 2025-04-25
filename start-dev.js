
#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting the development server with Rollup dependency workaround...');

// Create a custom environment with NODE_OPTIONS to avoid Rollup native dependencies
const customEnv = Object.assign({}, process.env);
customEnv.NODE_OPTIONS = '--no-addons'; // Disable native addons to prevent Rollup issues

// Start Vite with the custom environment
const viteProcess = spawn('npx', ['vite'], {
  stdio: 'inherit',
  env: customEnv,
  shell: true
});

viteProcess.on('error', (err) => {
  console.error('Failed to start Vite:', err);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Vite process exited with code ${code}`);
    process.exit(code);
  }
});
