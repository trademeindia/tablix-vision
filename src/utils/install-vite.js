
#!/usr/bin/env node

// Check if Vite is installed, and if not, install it
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Checking for Vite installation...');

try {
  // Check if vite exists in node_modules
  const viteExists = fs.existsSync(path.join(process.cwd(), 'node_modules', 'vite'));
  
  if (!viteExists) {
    console.log('Vite not found, installing...');
    execSync('npm install --save-dev vite', { stdio: 'inherit' });
    console.log('Vite installed successfully!');
  } else {
    console.log('Vite is already installed.');
  }
} catch (error) {
  console.error('Error installing Vite:', error.message);
  process.exit(1);
}
