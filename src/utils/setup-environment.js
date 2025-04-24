
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

console.log('Setting up environment for Lovable development...');

// Make scripts executable
require('./ensure-executable');

// Check for node_modules
const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('node_modules not found, installing dependencies...');
  spawnSync('npm', ['install'], { stdio: 'inherit' });
}

console.log('Environment setup complete, ready to run the application');
console.log('To start the development server, run: npm run dev');
