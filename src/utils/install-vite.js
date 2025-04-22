
#!/usr/bin/env node

// Script to ensure Vite is installed
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Checking for Vite installation...');

// Try to find Vite in node_modules
const viteExists = fs.existsSync(path.resolve(process.cwd(), 'node_modules', 'vite'));
const viteExecPath = path.resolve(process.cwd(), 'node_modules', '.bin', 'vite');
const viteExecExists = fs.existsSync(viteExecPath);

if (!viteExists || !viteExecExists) {
  console.log('Vite not found or executable missing. Installing vite and plugin-react-swc...');
  try {
    // Install vite and the swc plugin
    execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { 
      stdio: 'inherit'
    });
    
    console.log('Vite installation complete!');
  } catch (error) {
    console.error('Failed to install Vite:', error.message);
    process.exit(1);
  }
} else {
  console.log('Vite is already installed.');
}

// Make script executable
try {
  if (process.platform !== 'win32') {
    fs.chmodSync(viteExecPath, '755');
    console.log('Made Vite executable');
  }
} catch (err) {
  console.warn('Could not change permissions:', err.message);
}

console.log('Vite should now be ready for use.');
