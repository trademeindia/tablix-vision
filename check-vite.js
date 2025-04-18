
#!/usr/bin/env node

// Simple script to check if Vite is installed and working
const path = require('path');
const fs = require('fs');

// Print out the current working directory
console.log('Current working directory:', process.cwd());

// Check if node_modules exists
const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
console.log('Checking for node_modules at:', nodeModulesPath);

if (fs.existsSync(nodeModulesPath)) {
  console.log('node_modules directory exists');
} else {
  console.log('node_modules directory does NOT exist');
}

// Look for vite in potential locations
const potentialPaths = [
  path.resolve(process.cwd(), 'node_modules', '.bin', 'vite'),
  path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js'),
  path.resolve(process.cwd(), 'node_modules', 'vite', 'package.json')
];

console.log('Checking for Vite in potential locations:');
potentialPaths.forEach(p => {
  const exists = fs.existsSync(p);
  console.log(`- ${p}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
});

console.log('\nVite version check:');
try {
  const vitePkgPath = path.resolve(process.cwd(), 'node_modules', 'vite', 'package.json');
  if (fs.existsSync(vitePkgPath)) {
    const vitePkg = JSON.parse(fs.readFileSync(vitePkgPath, 'utf8'));
    console.log(`Vite version: ${vitePkg.version}`);
  } else {
    console.log('Vite package.json not found');
  }
} catch (err) {
  console.error('Error checking Vite version:', err.message);
}

console.log('\nIf Vite is properly installed, you should run the start-dev.js script with:');
console.log('node start-dev.js');
