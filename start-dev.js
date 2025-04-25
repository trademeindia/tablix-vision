
#!/usr/bin/env node

// Run the node installation script and then start the server
const { execSync } = require('child_process');

try {
  console.log('Ensuring Vite is installed...');
  require('./src/utils/ensure-vite');
  
  console.log('Starting development server...');
  execSync('node src/utils/start-app.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error running development server:', error.message);
  process.exit(1);
}
