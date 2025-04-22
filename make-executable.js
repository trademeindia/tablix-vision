
#!/usr/bin/env node

// Make scripts executable
const { execSync } = require('child_process');

if (process.platform !== 'win32') {
  try {
    execSync('chmod +x src/utils/install-vite.js start-vite.js update-scripts.js make-executable.js', {
      stdio: 'inherit'
    });
    console.log('Scripts are now executable');
  } catch (error) {
    console.error('Error making scripts executable:', error.message);
  }
}
