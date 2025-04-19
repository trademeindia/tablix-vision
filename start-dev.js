
#!/usr/bin/env node

// Script to start the development server using Vite with enhanced error handling
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
  
  console.log('Starting development server with:', viteCommand);
  
  // Determine appropriate arguments based on the command
  const command = viteCommand === 'npx' ? 'npx' : 
                 (process.platform === 'win32' && !viteCommand.endsWith('.js')) ? viteCommand : 'node';
  
  let args;
  if (viteCommand === 'npx') {
    args = ['vite'];
  } else if (process.platform === 'win32' && !viteCommand.endsWith('.js')) {
    args = [];
  } else {
    args = [viteCommand];
  }
  
  console.log(`Running: ${command} ${args.join(' ')}`);
  
  const devProcess = spawn(
    command,
    args,
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
  
  devProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Development server exited with code ${code}`);
    }
    process.exit(code);
  });
} catch (error) {
  console.error('Error starting development server:', error.message);
  console.log('Attempting final fallback to npx vite...');
  
  try {
    const npxProcess = spawn('npx', ['vite'], {
      stdio: 'inherit',
      shell: true
    });
    
    npxProcess.on('error', (err) => {
      console.error('All attempts to start development server failed:', err);
      console.error('Please ensure Vite is installed. Try running: npm install vite@latest');
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
    console.error('Please ensure Vite is installed. Try running: npm install vite@latest');
    process.exit(1);
  }
}
