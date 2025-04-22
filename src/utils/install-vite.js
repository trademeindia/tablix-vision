
#!/usr/bin/env node

// Script to ensure Vite is installed and available
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Checking for Vite installation...');

try {
  // Try to find Vite in node_modules
  const viteExists = fs.existsSync(path.resolve(process.cwd(), 'node_modules', 'vite'));
  const viteExecPath = path.resolve(process.cwd(), 'node_modules', '.bin', 'vite');
  const viteExecExists = fs.existsSync(viteExecPath);

  if (!viteExists || !viteExecExists) {
    console.log('Vite not found or executable missing. Installing vite and plugin-react-swc...');
    
    // Install vite and the swc plugin
    execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { 
      stdio: 'inherit'
    });
    
    console.log('Vite installation complete!');
  } else {
    console.log('Vite is already installed.');
  }

  // Make script executable
  if (process.platform !== 'win32') {
    try {
      fs.chmodSync(viteExecPath, '755');
      console.log('Made Vite executable');
    } catch (err) {
      console.warn('Could not change permissions:', err.message);
    }
  }

  console.log('Vite should now be ready for use.');
} catch (error) {
  console.error('Error during Vite installation:', error.message);
  process.exit(1);
}
