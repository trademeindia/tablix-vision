
#!/usr/bin/env node

// Script to build the project using Vite with enhanced error handling
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log current working directory for debugging
console.log('Current working directory:', process.cwd());

// Ensure Vite is installed before attempting to build
try {
  console.log('Ensuring Vite is installed...');
  require('./src/utils/ensure-vite');
  
  console.log('Building project with NPX for maximum compatibility');
  
  // Use npx for most reliable execution across environments
  const buildProcess = spawn(
    'npx',
    ['vite', 'build'],
    {
      stdio: 'inherit',
      shell: true
    }
  );
  
  buildProcess.on('error', (err) => {
    console.error('Failed to build project:', err);
    console.error('Please ensure Vite is installed. Try running: npm install vite@4.5.1 @vitejs/plugin-react-swc@3.3.2 --save-dev');
    process.exit(1);
  });
  
  buildProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Build process exited with code ${code}`);
    }
    process.exit(code);
  });
} catch (error) {
  console.error('Error building project:', error.message);
  console.error('Please ensure Vite is installed. Try running: npm install vite@4.5.1 @vitejs/plugin-react-swc@3.3.2 --save-dev');
  process.exit(1);
}
