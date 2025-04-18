
#!/usr/bin/env node

// This is a helper script to launch Vite
// It will search for the vite executable in node_modules and run it

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const findViteExecutable = () => {
  const potentialPaths = [
    path.resolve(process.cwd(), 'node_modules', '.bin', 'vite'),
    path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js')
  ];
  
  for (const p of potentialPaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  
  throw new Error('Vite executable not found. Please ensure vite is installed.');
};

try {
  const viteExe = findViteExecutable();
  console.log(`Found Vite at: ${viteExe}`);
  
  // Run Vite with any arguments passed to this script
  const viteProcess = spawn('node', [viteExe, ...process.argv.slice(2)], {
    stdio: 'inherit',
    shell: true
  });
  
  viteProcess.on('error', (err) => {
    console.error('Failed to start Vite:', err);
    process.exit(1);
  });
  
  viteProcess.on('close', (code) => {
    process.exit(code);
  });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
