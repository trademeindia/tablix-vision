
#!/usr/bin/env node

// This is a helper script to launch Vite
// It will search for the vite executable in node_modules and run it

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const findViteExecutable = () => {
  const potentialPaths = [
    path.resolve(process.cwd(), 'node_modules', '.bin', 'vite'),
    path.resolve(process.cwd(), 'node_modules', '.bin', 'vite.cmd'), // For Windows
    path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js')
  ];
  
  for (const p of potentialPaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  
  // Fallback to npx
  console.warn('Vite executable not found in expected locations. Using npx vite as fallback.');
  return 'npx';
};

try {
  const viteExe = findViteExecutable();
  console.log(`Found Vite at: ${viteExe}`);
  
  // Run Vite with any arguments passed to this script
  const args = viteExe === 'npx' ? ['vite', ...process.argv.slice(2)] : [...process.argv.slice(2)];
  
  const viteProcess = spawn(
    viteExe === 'npx' ? 'npx' : 'node', 
    viteExe === 'npx' ? args : [viteExe, ...args], 
    {
      stdio: 'inherit',
      shell: true
    }
  );
  
  viteProcess.on('error', (err) => {
    console.error('Failed to start Vite:', err);
    console.log('Attempting fallback to npx vite...');
    
    const npxProcess = spawn('npx', ['vite', ...process.argv.slice(2)], {
      stdio: 'inherit',
      shell: true
    });
    
    npxProcess.on('error', (npxErr) => {
      console.error('Fallback also failed:', npxErr);
      process.exit(1);
    });
  });
  
  viteProcess.on('close', (code) => {
    process.exit(code);
  });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
