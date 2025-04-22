
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
        
        // Determine package manager (npm, yarn, pnpm)
        let packageManager = 'npm';
        if (fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'))) {
          packageManager = 'yarn';
        } else if (fs.existsSync(path.resolve(process.cwd(), 'pnpm-lock.yaml'))) {
          packageManager = 'pnpm';
        }
        
        // Install command based on package manager
        let installCommand;
        switch (packageManager) {
          case 'yarn':
            installCommand = 'yarn add --dev vite @vitejs/plugin-react-swc';
            break;
          case 'pnpm':
            installCommand = 'pnpm add --save-dev vite @vitejs/plugin-react-swc';
            break;
          default:
            installCommand = 'npm install --save-dev vite @vitejs/plugin-react-swc';
        }
        
        // Execute installation
        console.log(`Executing: ${installCommand}`);
        execSync(installCommand, { stdio: 'inherit' });
        console.log('Vite has been installed successfully.');
      }
    }
  } catch (error) {
    console.error('Error ensuring Vite is installed:', error);
  }
}

// Run the function
ensureVite();

module.exports = ensureVite;
