
#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('Making start-dev.js executable...');

try {
  // First check if we're on Windows
  const isWindows = process.platform === 'win32';
  
  if (!isWindows) {
    // On Unix systems, make the file executable
    fs.chmodSync('./start-dev.js', 0o755);
    console.log('Successfully made start-dev.js executable.');
  } else {
    console.log('Running on Windows - no need to make script executable.');
  }
} catch (error) {
  console.error('Failed to make script executable:', error.message);
}

console.log('Done! You can now run "node start-dev.js" to start the development server.');
