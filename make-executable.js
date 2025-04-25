
#!/usr/bin/env node

const fs = require('fs');

console.log('Making start-dev.js executable...');

try {
  const isWindows = process.platform === 'win32';
  
  if (!isWindows) {
    fs.chmodSync('./start-dev.js', 0o755);
    console.log('Successfully made start-dev.js executable.');
  } else {
    console.log('Running on Windows - no need to make script executable.');
  }
} catch (error) {
  console.error('Failed to make script executable:', error.message);
}
