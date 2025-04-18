
#!/usr/bin/env node

// Script to start the development server using Vite
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log current working directory to help with debugging
console.log('Current working directory:', process.cwd());

const findViteExecutable = () => {
  // Possible locations for the Vite executable
  const potentialPaths = [
    path.resolve(process.cwd(), 'node_modules', '.bin', 'vite'),
    path.resolve(process.cwd(), 'node_modules', '.bin', 'vite.cmd'), // For Windows
    path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js'),
    // Global installations
    'vite'
  ];
  
  // Check if files exist for local paths
  for (const p of potentialPaths) {
    if (p === 'vite' || (fs.existsSync(p) && fs.statSync(p).isFile())) {
      console.log(`Found Vite at: ${p}`);
      return p;
    }
  }
  
  console.error('Vite executable not found in expected locations. Using fallback "npx vite"');
  return 'npx';
};

try {
  const viteCommand = findViteExecutable();
  
  console.log('Starting development server...');
  
  // If we're using npx as fallback, we need different arguments
  const isNpxFallback = viteCommand === 'npx';
  
  const devProcess = spawn(
    viteCommand,
    isNpxFallback ? ['vite'] : [],
    {
      stdio: 'inherit',
      shell: true
    }
  );
  
  devProcess.on('error', (err) => {
    console.error('Failed to start development server:', err);
    
    // Try fallback to npx if local vite fails
    if (viteCommand !== 'npx') {
      console.log('Attempting fallback to npx vite...');
      const npxProcess = spawn('npx', ['vite'], {
        stdio: 'inherit',
        shell: true
      });
      
      npxProcess.on('error', (npxErr) => {
        console.error('Fallback also failed:', npxErr);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
  
  devProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Development server exited with code ${code}`);
    }
    process.exit(code);
  });
} catch (error) {
  console.error('Error starting development server:', error.message);
  console.log('Attempting fallback to npx vite...');
  
  try {
    const npxProcess = spawn('npx', ['vite'], {
      stdio: 'inherit',
      shell: true
    });
    
    npxProcess.on('error', (err) => {
      console.error('Failed to start development server with npx:', err);
      process.exit(1);
    });
    
    npxProcess.on('close', (code) => {
      if (code !== 0) {
        console.log(`Development server exited with code ${code}`);
      }
      process.exit(code);
    });
  } catch (fallbackError) {
    console.error('All attempts to start the dev server failed:', fallbackError.message);
    process.exit(1);
  }
}
