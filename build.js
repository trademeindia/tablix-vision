
#!/usr/bin/env node

// Simple script to build the project
const { spawn } = require('child_process');
const path = require('path');

const vitePath = path.resolve(__dirname, 'node_modules', '.bin', 'vite');

console.log('Building project...');
console.log(`Using Vite from: ${vitePath}`);

const buildProcess = spawn('node', [vitePath, 'build'], {
  stdio: 'inherit',
  shell: true
});

buildProcess.on('error', (err) => {
  console.error('Failed to build project:', err);
  process.exit(1);
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`Build process exited with code ${code}`);
  }
  process.exit(code);
});
