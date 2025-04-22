
#!/usr/bin/env node

// Advanced script to start the development server with robust error handling
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Preparing to start development server...');

// First, ensure Vite is installed
try {
  // Run the ensure-vite script
  require('./src/utils/ensure-vite.js');
  
  console.log('Starting development server with Vite...');
  
  // Try to start vite using npx (most reliable cross-platform method)
  const devProcess = spawn('npx', ['vite'], {
    stdio: 'inherit',
    shell: true
  });
  
  devProcess.on('error', (err) => {
    console.error('Failed to start Vite with npx:', err.message);
    console.log('Trying alternative startup method...');
    
    try {
      // Try direct path to Vite bin
      const vitePath = path.resolve(process.cwd(), 'node_modules', '.bin', 
        process.platform === 'win32' ? 'vite.cmd' : 'vite');
      
      if (fs.existsSync(vitePath)) {
        console.log(`Found Vite at: ${vitePath}`);
        const altProcess = spawn(vitePath, [], {
          stdio: 'inherit',
          shell: true
        });
        
        altProcess.on('error', (altErr) => {
          console.error('Alternative startup also failed:', altErr.message);
          process.exit(1);
        });
      } else {
        console.error('Vite executable not found. Trying to install again...');
        execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { 
          stdio: 'inherit' 
        });
        console.log('Retrying with npx vite...');
        spawn('npx', ['vite'], { stdio: 'inherit', shell: true });
      }
    } catch (finalError) {
      console.error('All attempts to start Vite failed:', finalError.message);
      console.error('Please try running: npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest');
      process.exit(1);
    }
  });
  
  devProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Vite process exited with code ${code}`);
    }
    process.exit(code);
  });
} catch (error) {
  console.error('Failed to start development server:', error.message);
  process.exit(1);
}
