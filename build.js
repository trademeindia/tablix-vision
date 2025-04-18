
#!/usr/bin/env node

// Simple script to build the project
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const findViteExecutable = () => {
  const potentialPaths = [
    path.resolve(__dirname, 'node_modules', '.bin', 'vite'),
    path.resolve(__dirname, 'node_modules', 'vite', 'bin', 'vite.js')
  ];
  
  for (const p of potentialPaths) {
    if (fs.existsSync(p)) {
      console.log(`Found Vite at: ${p}`);
      return p;
    }
  }
  
  throw new Error('Vite executable not found. Please ensure vite is installed.');
};

try {
  const vitePath = findViteExecutable();
  
  console.log('Building project...');
  
  const buildProcess = spawn('node', [vitePath, 'build'], {
    stdio: 'inherit',
    shell: true
  });
  
  buildProcess.on('error', (err) => {
    console.error('Failed to build project:', err);
    process.exit(1);
  });
  
  buildProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Build process exited with code ${code}`);
    }
    process.exit(code);
  });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
