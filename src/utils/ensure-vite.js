
#!/usr/bin/env node

// This script ensures that Vite is installed in development environments
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function ensureVite() {
  try {
    // Check if we're in a development environment
    if (process.env.NODE_ENV !== 'production') {
      console.log('Checking for Vite installation...');
      
      // Try to require vite to see if it's installed
      try {
        require.resolve('vite');
        console.log('Vite is already installed. Continuing...');
      } catch (e) {
        // Vite is not installed, install it
        console.log('Vite not found. Installing vite and @vitejs/plugin-react-swc...');
        
        try {
          // Install Vite and the React SWC plugin
          execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { 
            stdio: 'inherit' 
          });
          console.log('Vite has been installed successfully.');
          
          // Make the vite executable file executable on Unix-based systems
          if (process.platform !== 'win32') {
            const binPath = path.resolve(process.cwd(), 'node_modules', '.bin');
            const vitePath = path.join(binPath, 'vite');
            if (fs.existsSync(vitePath)) {
              fs.chmodSync(vitePath, '755');
              console.log('Made Vite executable.');
            }
          }
          
          // Verify installation
          try {
            execSync('npx vite --version', { stdio: 'inherit' });
          } catch (verifyError) {
            console.error('Could not verify Vite installation:', verifyError.message);
          }
        } catch (installError) {
          console.error('Failed to install Vite:', installError.message);
          console.log('Trying alternative installation method...');
          
          try {
            execSync('npx -y vite@latest', { stdio: 'inherit' });
            console.log('Vite has been installed via npx.');
          } catch (npxError) {
            console.error('All installation methods failed:', npxError.message);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error ensuring Vite is installed:', error);
  }
}

// Run the function
ensureVite();

module.exports = ensureVite;
