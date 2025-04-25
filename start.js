
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting the Menu360 application...');

// Make sure everything is executable
try {
  // On Unix systems, make scripts executable
  if (process.platform !== 'win32') {
    const scriptsToMakeExecutable = [
      'src/utils/start-app.js',
      'src/utils/ensure-executable.js',
      'start.js'
    ];
    
    scriptsToMakeExecutable.forEach(script => {
      try {
        fs.chmodSync(path.resolve(process.cwd(), script), '755');
        console.log(`Made ${script} executable`);
      } catch (error) {
        console.warn(`Could not make ${script} executable:`, error.message);
      }
    });
  }
  
  // Start the app
  console.log('Starting application server...');
  execSync('node src/utils/start-app.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting application:', error.message);
  console.error('Try running: node src/utils/start-app.js directly');
  process.exit(1);
}
