
#!/usr/bin/env node

// Script to start the development server using Vite with enhanced error handling
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log current working directory for debugging
console.log('Current working directory:', process.cwd());

// Ensure Vite is installed before attempting to start dev server
try {
  const viteModulePath = path.resolve(process.cwd(), 'node_modules', 'vite');
  const viteExists = fs.existsSync(viteModulePath);
  
  if (!viteExists) {
    console.log('Vite not installed, installing now...');
    require('./src/utils/ensure-vite.js');
  }
  
  console.log('Starting development server with NPX for maximum compatibility');
  
  // Use npx for most reliable execution across environments
  const devProcess = spawn(
    'npx',
    ['vite'],
    {
      stdio: 'inherit',
      shell: true
    }
  );
  
  devProcess.on('error', (err) => {
    console.error('Failed to start development server:', err);
    console.error('Please ensure Vite is installed. Try running: npm install vite@4.5.1 @vitejs/plugin-react-swc@3.3.2 --save-dev');
    process.exit(1);
  });
  
  devProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Development server exited with code ${code}`);
    }
    process.exit(code);
  });
} catch (error) {
  console.error('Error starting development server:', error.message);
  console.error('Please ensure Vite is installed. Try running: npm install vite@4.5.1 @vitejs/plugin-react-swc@3.3.2 --save-dev');
  process.exit(1);
}
