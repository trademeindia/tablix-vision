
#!/usr/bin/env node

// Script to build the project using Vite
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
    path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js')
  ];
  
  // Check if files exist for local paths
  for (const p of potentialPaths) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      console.log(`Found Vite at: ${p}`);
      return p;
    }
  }
  
  console.log('Vite executable not found in expected locations. Using npx vite as fallback.');
  return 'npx';
};

try {
  const viteCommand = findViteExecutable();
  
  console.log('Building project...');
  
  // Determine appropriate arguments based on the command
  const args = viteCommand === 'npx' ? ['vite', 'build'] : ['build'];
  const command = viteCommand === 'npx' ? 'npx' : 'node';
  const fullArgs = viteCommand === 'npx' ? args : [viteCommand, ...args];
  
  console.log(`Running: ${command} ${fullArgs.join(' ')}`);
  
  const buildProcess = spawn(
    command,
    fullArgs,
    {
      stdio: 'inherit',
      shell: true
    }
  );
  
  buildProcess.on('error', (err) => {
    console.error('Failed to build project:', err);
    
    // Try fallback to npx if local vite fails
    if (viteCommand !== 'npx') {
      console.log('Attempting fallback to npx vite build...');
      const npxProcess = spawn('npx', ['vite', 'build'], {
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
  
  buildProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Build process exited with code ${code}`);
    }
    process.exit(code);
  });
} catch (error) {
  console.error('Error building project:', error.message);
  console.log('Attempting fallback to npx vite build...');
  
  try {
    const npxProcess = spawn('npx', ['vite', 'build'], {
      stdio: 'inherit',
      shell: true
    });
    
    npxProcess.on('error', (err) => {
      console.error('Failed to build project with npx:', err);
      process.exit(1);
    });
    
    npxProcess.on('close', (code) => {
      if (code !== 0) {
        console.log(`Build process exited with code ${code}`);
      }
      process.exit(code);
    });
  } catch (fallbackError) {
    console.error('All attempts to build the project failed:', fallbackError.message);
    process.exit(1);
  }
}
