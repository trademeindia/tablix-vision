
#!/usr/bin/env node

// This is a helper script to launch Vite with robust error handling
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
    path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'vite'),
    path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'vite.cmd')
  ];
  
  // Check if files exist and are executable
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
  
  // Fallback to npx vite as a universal solution
  console.warn('Vite executable not found in expected locations. Using npx vite as fallback.');
  return 'npx';
};

// Try to run vite with careful error handling
try {
  const viteCommand = findViteExecutable();
  
  console.log('Starting Vite with command:', viteCommand);
  
  // Determine appropriate arguments based on the command
  const args = viteCommand === 'npx' ? ['vite', ...process.argv.slice(2)] : process.argv.slice(2);
  const command = viteCommand === 'npx' ? 'npx' : process.platform === 'win32' ? viteCommand : 'node';
  const fullArgs = viteCommand === 'npx' ? args : viteCommand === process.platform === 'win32' ? args : [viteCommand, ...args];
  
  console.log(`Running: ${command} ${fullArgs.join(' ')}`);
  
  const viteProcess = spawn(
    command,
    fullArgs,
    {
      stdio: 'inherit',
      shell: true
    }
  );
  
  viteProcess.on('error', (err) => {
    console.error('Failed to start Vite:', err);
    console.log('Attempting fallback to npx vite...');
    
    // If the primary method failed, try the universal npx fallback
    const npxProcess = spawn('npx', ['vite', ...process.argv.slice(2)], {
      stdio: 'inherit',
      shell: true
    });
    
    npxProcess.on('error', (npxErr) => {
      console.error('Fallback also failed:', npxErr);
      console.error('Please ensure you have Vite installed. Try running: npm install vite@latest');
      process.exit(1);
    });
    
    npxProcess.on('close', (code) => {
      process.exit(code);
    });
  });
  
  viteProcess.on('close', (code) => {
    process.exit(code);
  });
} catch (error) {
  console.error('Error launching Vite:', error.message);
  console.log('Attempting fallback to npx vite...');
  
  // Final fallback attempt using npx
  try {
    const npxProcess = spawn('npx', ['vite', ...process.argv.slice(2)], {
      stdio: 'inherit',
      shell: true
    });
    
    npxProcess.on('error', (err) => {
      console.error('All attempts to run Vite failed:', err);
      console.error('Please ensure you have Vite installed. Try running: npm install vite@latest');
      process.exit(1);
    });
    
    npxProcess.on('close', (code) => {
      process.exit(code);
    });
  } catch (fallbackError) {
    console.error('All attempts to run Vite failed:', fallbackError.message);
    console.error('Please ensure you have Vite installed. Try running: npm install vite@latest');
    process.exit(1);
  }
}
