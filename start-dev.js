
#!/usr/bin/env node

// Script to start the development server using Vite with enhanced error handling
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log current working directory for debugging
console.log('Current working directory:', process.cwd());

// Check for npx availability (should be available with npm)
const startWithNpx = () => {
  console.log('Starting with npx vite...');
  
  const devProcess = spawn(
    'npx',
    ['vite'],
    {
      stdio: 'inherit',
      shell: true
    }
  );
  
  devProcess.on('error', (err) => {
    console.error('Failed to start with npx:', err);
    startWithNodeModules();
  });
  
  devProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Development server exited with code ${code}`);
    }
    process.exit(code);
  });
};

// Fallback to node_modules/.bin/vite
const startWithNodeModules = () => {
  console.log('Trying to start with node_modules/.bin/vite...');
  
  const viteBinPath = path.resolve(process.cwd(), 'node_modules', '.bin', 'vite');
  
  if (fs.existsSync(viteBinPath)) {
    const devProcess = spawn(
      viteBinPath,
      [],
      {
        stdio: 'inherit',
        shell: true
      }
    );
    
    devProcess.on('error', (err) => {
      console.error('Failed to start with node_modules/.bin/vite:', err);
      console.error('Please ensure Vite is installed. Try running: npm install vite@4.5.1 @vitejs/plugin-react-swc@3.3.2 --save-dev');
      process.exit(1);
    });
    
    devProcess.on('close', (code) => {
      process.exit(code);
    });
  } else {
    console.error('Could not find Vite executable in node_modules/.bin');
    console.error('Please ensure Vite is installed. Try running: npm install vite@4.5.1 @vitejs/plugin-react-swc@3.3.2 --save-dev');
    process.exit(1);
  }
};

// Start with npx first
startWithNpx();
