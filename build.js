
#!/usr/bin/env node

// Script to build the project using Vite with enhanced error handling
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log current working directory for debugging
console.log('Current working directory:', process.cwd());

const findViteExecutable = () => {
  // Possible locations for the Vite executable
  const potentialPaths = [
    path.resolve(process.cwd(), 'node_modules', '.bin', 'vite'),
    path.resolve(process.cwd(), 'node_modules', '.bin', 'vite.cmd'), // For Windows
    path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js'),
    // Additional potential paths
    path.resolve(__dirname, 'node_modules', '.bin', 'vite'),
    path.resolve(__dirname, 'node_modules', '.bin', 'vite.cmd')
  ];
  
  // Check if files exist for local paths and are executable
  for (const p of potentialPaths) {
    if (fs.existsSync(p)) {
      try {
        const stats = fs.statSync(p);
        if (stats.isFile()) {
          console.log(`Found Vite at: ${p}`);
          return p;
        }
      } catch (err) {
        console.warn(`Error checking path ${p}:`, err.message);
      }
    }
  }
  
  console.log('Vite executable not found in expected locations. Using npx vite as fallback.');
  return 'npx';
};

try {
  const viteCommand = findViteExecutable();
  
  console.log('Building project with:', viteCommand);
  
  // Determine appropriate arguments based on the command
  const command = viteCommand === 'npx' ? 'npx' : 
                 (process.platform === 'win32' && !viteCommand.endsWith('.js')) ? viteCommand : 'node';
  
  let args;
  if (viteCommand === 'npx') {
    args = ['vite', 'build'];
  } else if (process.platform === 'win32' && !viteCommand.endsWith('.js')) {
    args = ['build'];
  } else {
    args = [viteCommand, 'build'];
  }
  
  console.log(`Running: ${command} ${args.join(' ')}`);
  
  const buildProcess = spawn(
    command,
    args,
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
        console.error('Please ensure Vite is installed. Try running: npm install vite@latest');
        process.exit(1);
      });
      
      npxProcess.on('close', (code) => {
        process.exit(code);
      });
    } else {
      console.error('Please ensure Vite is installed. Try running: npm install vite@latest');
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
  console.log('Attempting final fallback to npx vite build...');
  
  try {
    const npxProcess = spawn('npx', ['vite', 'build'], {
      stdio: 'inherit',
      shell: true
    });
    
    npxProcess.on('error', (err) => {
      console.error('All attempts to build project failed:', err);
      console.error('Please ensure Vite is installed. Try running: npm install vite@latest');
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
    console.error('Please ensure Vite is installed. Try running: npm install vite@latest');
    process.exit(1);
  }
}
