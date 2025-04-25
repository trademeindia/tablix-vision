
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting the application...');

// Execute ensure-executable first
try {
  require('./src/utils/ensure-executable');
} catch (error) {
  console.warn('Could not run ensure-executable:', error.message);
}

// Start the application
try {
  console.log('Starting with Rollup platform dependency workarounds...');
  execSync('node src/utils/start-app.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting application:', error.message);
  console.log('Please check the errors above and try again.');
  process.exit(1);
}
