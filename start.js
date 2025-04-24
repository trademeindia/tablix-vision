
#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Starting the Menu360 application...');

// Run setup
try {
  console.log('Setting up environment...');
  execSync('node src/utils/setup-environment.js', { stdio: 'inherit' });
  
  // Run the app
  console.log('Starting application server...');
  execSync('node src/utils/start-app.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting application:', error.message);
  process.exit(1);
}
