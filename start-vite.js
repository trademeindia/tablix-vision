
#!/usr/bin/env node

// Script to run Vite after ensuring it's installed
const { spawnSync } = require('child_process');
const path = require('path');

console.log('Starting Vite development server...');

// First run the installation script
require('./src/utils/install-vite.js');

// Then start Vite
console.log('Launching Vite server...');
const result = spawnSync('npx', ['vite'], {
  stdio: 'inherit',
  shell: true
});

// Exit with the same code as the Vite process
process.exit(result.status);
