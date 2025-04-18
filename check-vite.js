
#!/usr/bin/env node

// Script to diagnose Vite installation issues
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Print out the current working directory
console.log('Current working directory:', process.cwd());

// Check if node_modules exists
const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
console.log('Checking for node_modules at:', nodeModulesPath);

if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules directory exists');
} else {
  console.log('❌ node_modules directory does NOT exist');
  console.log('Run "npm install" to install dependencies');
}

// Check for Vite in potential locations
const potentialPaths = [
  path.resolve(process.cwd(), 'node_modules', '.bin', 'vite'),
  path.resolve(process.cwd(), 'node_modules', '.bin', 'vite.cmd'), // Windows
  path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js'),
  path.resolve(process.cwd(), 'node_modules', 'vite', 'package.json')
];

console.log('\nChecking for Vite in potential locations:');
potentialPaths.forEach(p => {
  const exists = fs.existsSync(p);
  console.log(`- ${p}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
});

// Check Vite version
console.log('\nVite version check:');
try {
  const vitePkgPath = path.resolve(process.cwd(), 'node_modules', 'vite', 'package.json');
  if (fs.existsSync(vitePkgPath)) {
    const vitePkg = JSON.parse(fs.readFileSync(vitePkgPath, 'utf8'));
    console.log(`✅ Vite version: ${vitePkg.version}`);
  } else {
    console.log('❌ Vite package.json not found');
  }
} catch (err) {
  console.error('❌ Error checking Vite version:', err.message);
}

// Try to run Vite directly
console.log('\nTrying to run Vite directly:');
try {
  const viteProcess = spawn('npx', ['vite', '--version'], {
    stdio: 'pipe',
    shell: true
  });
  
  let output = '';
  viteProcess.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  viteProcess.on('close', (code) => {
    if (code === 0 && output.trim()) {
      console.log(`✅ Successfully ran Vite: version ${output.trim()}`);
    } else {
      console.log(`❌ Failed to run Vite directly. Exit code: ${code}`);
    }
    
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Run the development server with: node start-dev.js');
    console.log('2. Build the project with: node build.js');
    console.log('3. If issues persist, try running: npm install vite@latest');
  });
} catch (err) {
  console.error('❌ Error running Vite:', err.message);
}
