
#!/usr/bin/env node

// This script ensures Vite is installed and available
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Ensuring Vite is properly installed...');

try {
  // Check if vite is installed in node_modules
  const viteExists = fs.existsSync(path.join(process.cwd(), 'node_modules', '.bin', 'vite')) || 
                      fs.existsSync(path.join(process.cwd(), 'node_modules', '.bin', 'vite.cmd'));
  
  if (!viteExists) {
    console.log('Vite not found in node_modules, installing...');
    
    // Install vite and react-swc plugin
    execSync('npm install vite@latest @vitejs/plugin-react-swc@latest --save-dev', {
      stdio: 'inherit',
      shell: true
    });
    
    console.log('Vite has been installed successfully!');
  } else {
    console.log('Vite is already installed.');
  }
  
  console.log('Starting the application...');
  
} catch (error) {
  console.error('Error ensuring Vite is installed:', error);
  process.exit(1);
}
