
#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log current working directory for debugging
console.log('Current working directory:', process.cwd());

// Comprehensive Vite executable finder
const findViteExecutable = () => {
  const potentialPaths = [
    path.resolve(process.cwd(), 'node_modules', '.bin', 'vite'),
    path.resolve(process.cwd(), 'node_modules', '.bin', 'vite.cmd'), // Windows support
    path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js'),
    // Additional potential locations
    path.resolve(__dirname, 'node_modules', '.bin', 'vite'),
    path.resolve(__dirname, 'node_modules', '.bin', 'vite.cmd')
  ];
  
  for (const p of potentialPaths) {
    if (fs.existsSync(p)) {
      console.log(`Found Vite executable at: ${p}`);
      return p;
    }
  }
  
  return null;
};

// Try launching Vite with multiple strategies
const launchVite = () => {
  // Strategy 1: Use found executable
  const viteExecutable = findViteExecutable();
  if (viteExecutable) {
    console.log('Attempting to launch Vite via found executable');
    const devProcess = spawn(
      viteExecutable, 
      [], 
      { stdio: 'inherit', shell: true }
    );
    
    devProcess.on('error', (err) => {
      console.error('Executable launch failed:', err);
      tryNpxVite();
    });
    
    return;
  }
  
  // Strategy 2: Use npx
  tryNpxVite();
};

// Fallback to npx Vite
const tryNpxVite = () => {
  console.log('Falling back to npx vite');
  const npxProcess = spawn(
    'npx', 
    ['vite'], 
    { stdio: 'inherit', shell: true }
  );
  
  npxProcess.on('error', (err) => {
    console.error('npx vite failed:', err);
    console.error('Please ensure Node.js and npm are correctly installed.');
    process.exit(1);
  });
};

// Start the launch process
launchVite();

