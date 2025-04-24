
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Run the custom server instead of Vite
try {
  console.log('Starting development server...');
  execSync('node src/utils/start-app.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting development server:', error.message);
  process.exit(1);
}
