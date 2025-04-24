
#!/usr/bin/env node

const { execSync } = require('child_process');

// First run the vite installation script
try {
  require('./src/utils/install-vite.js');
  console.log('Starting development server...');
  execSync('npx vite', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting development server:', error.message);
  process.exit(1);
}
