
#!/usr/bin/env node

// Script to ensure Vite is installed and available
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Checking for Vite installation...');

try {
  // Check if vite is installed
  try {
    require.resolve('vite');
    console.log('Vite is already installed.');
  } catch (e) {
    console.log('Vite not found. Installing vite and plugin-react-swc...');
    
    // Install vite and the swc plugin
    execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { 
      stdio: 'inherit'
    });
    
    console.log('Vite installation complete!');
  }

  // Check if the binary exists and is executable
  const binPath = path.resolve(process.cwd(), 'node_modules', '.bin');
  const vitePath = path.join(binPath, process.platform === 'win32' ? 'vite.cmd' : 'vite');
  
  if (fs.existsSync(vitePath)) {
    console.log(`Vite executable found at: ${vitePath}`);
    
    // Make script executable (for non-Windows platforms)
    if (process.platform !== 'win32') {
      try {
        fs.chmodSync(vitePath, '755');
        console.log('Made Vite executable');
      } catch (err) {
        console.warn('Could not change permissions:', err.message);
      }
    }
  } else {
    console.warn(`Vite executable not found at expected path: ${vitePath}`);
    console.log('You may need to run the installation again or use npx vite to start the server');
  }

  console.log('Vite setup complete.');
} catch (error) {
  console.error('Error during Vite installation:', error.message);
  process.exit(1);
}
