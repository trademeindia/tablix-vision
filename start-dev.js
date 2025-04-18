
#!/usr/bin/env node

// Simple script to start the development server
const { spawn } = require('child_process');
const path = require('path');

const vitePath = path.resolve(__dirname, 'node_modules', '.bin', 'vite');

console.log('Starting development server...');
console.log(`Using Vite from: ${vitePath}`);

const devProcess = spawn('node', [vitePath], {
  stdio: 'inherit',
  shell: true
});

devProcess.on('error', (err) => {
  console.error('Failed to start development server:', err);
  process.exit(1);
});

devProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`Development server exited with code ${code}`);
  }
  process.exit(code);
});
