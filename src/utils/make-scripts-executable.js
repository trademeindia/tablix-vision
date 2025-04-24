
#!/usr/bin/env node

// Make the utility scripts executable
const { execSync } = require('child_process');

if (process.platform !== 'win32') {
  try {
    execSync('chmod +x src/utils/install-vite.js src/utils/update-scripts.js src/start-dev.js build.js', {
      stdio: 'inherit'
    });
    console.log('Made utility scripts executable');
  } catch (error) {
    console.warn('Failed to make scripts executable:', error.message);
    console.log('You may need to run: chmod +x src/utils/*.js start-dev.js build.js');
  }
}
