
#!/usr/bin/env node

// Make scripts executable
const { execSync } = require('child_process');

try {
  if (process.platform !== 'win32') {
    console.log('Making scripts executable...');
    
    execSync('chmod +x start-dev.js update-scripts.js make-executable.js src/utils/ensure-vite.js', {
      stdio: 'inherit'
    });
    
    console.log('Scripts are now executable');
  } else {
    console.log('Running on Windows - no need to make scripts executable');
  }
} catch (error) {
  console.error('Error making scripts executable:', error.message);
}
