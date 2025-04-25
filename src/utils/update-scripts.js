
#!/usr/bin/env node

// Script to update package.json scripts
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  console.log('Updating package.json scripts...');
  
  // Instead of directly modifying package.json, use npm commands
  console.log('Setting up development command...');
  execSync('npm pkg set "scripts.dev=node src/utils/start-app.js"', { stdio: 'inherit' });
  
  console.log('Setting up build command...');
  execSync('npm pkg set "scripts.build=node src/utils/start-app.js build"', { stdio: 'inherit' });
  
  console.log('Setting up preview command...');
  execSync('npm pkg set "scripts.preview=node src/utils/start-app.js preview"', { stdio: 'inherit' });
  
  console.log('Package.json scripts updated successfully!');
  console.log('You can now run "npm run dev" to start the development server.');
} catch (error) {
  console.error('Error updating package.json:', error.message);
  console.log('You may need to manually update your package.json scripts.');
  console.log('Add the following to your package.json scripts:');
  console.log('  "dev": "node src/utils/start-app.js",');
  console.log('  "build": "node src/utils/start-app.js build",');
  console.log('  "preview": "node src/utils/start-app.js preview"');
}
