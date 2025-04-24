
#!/usr/bin/env node

// Make the utility scripts executable
const { execSync } = require('child_process');
const fs = require('fs');

if (process.platform !== 'win32') {
  try {
    console.log('Making scripts executable...');
    execSync('chmod +x src/utils/*.js update-scripts.js start-vite.js', {
      stdio: 'inherit'
    });
    console.log('Scripts made executable successfully!');
  } catch (error) {
    console.warn('Failed to make scripts executable:', error.message);
    console.log('You may need to run: chmod +x src/utils/*.js update-scripts.js start-vite.js');
  }
}
