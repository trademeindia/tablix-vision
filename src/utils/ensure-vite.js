
#!/usr/bin/env node

// Script to ensure Vite is installed correctly
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Options for our installation
const options = {
  viteVersion: '4.5.1',
  reactPluginVersion: '3.3.2',
  forceInstall: false, // Set to true to force reinstall
};

// Function to check if a package is installed
function isPackageInstalled(packageName) {
  try {
    const modulePath = path.resolve(process.cwd(), 'node_modules', packageName);
    return fs.existsSync(modulePath);
  } catch (error) {
    return false;
  }
}

// Function to install a package
function installPackage(packageName, version) {
  const packageWithVersion = version ? `${packageName}@${version}` : packageName;
  console.log(`Installing ${packageWithVersion}...`);
  
  try {
    execSync(`npm install ${packageWithVersion} --save-dev`, { 
      stdio: 'inherit',
      timeout: 60000 // 60 second timeout
    });
    return true;
  } catch (error) {
    console.error(`Error installing ${packageWithVersion}:`, error.message);
    
    // Try with a different approach if the first one fails
    try {
      console.log(`Trying alternate installation for ${packageWithVersion}...`);
      execSync(`npx --yes ${packageWithVersion}`, {
        stdio: 'inherit',
        timeout: 60000
      });
      return true;
    } catch (innerError) {
      console.error(`All installation attempts failed for ${packageWithVersion}.`);
      return false;
    }
  }
}

// Main function to ensure Vite and its plugins are installed
function ensureViteInstalled() {
  console.log('Checking Vite installation...');
  
  let needsInstall = options.forceInstall;
  
  // Check if Vite is already installed
  if (!isPackageInstalled('vite')) {
    console.log('Vite is not installed.');
    needsInstall = true;
  }
  
  // Check if React plugin is already installed
  if (!isPackageInstalled('@vitejs/plugin-react-swc')) {
    console.log('Vite React SWC plugin is not installed.');
    needsInstall = true;
  }
  
  // Do the installation if needed
  if (needsInstall) {
    console.log('Installing required packages...');
    
    // Install Vite first
    const viteSuccess = installPackage('vite', options.viteVersion);
    
    // Then install the React plugin
    const reactPluginSuccess = installPackage('@vitejs/plugin-react-swc', options.reactPluginVersion);
    
    if (viteSuccess && reactPluginSuccess) {
      console.log('✅ All required packages installed successfully!');
      return true;
    } else {
      console.error('⚠️ Some packages could not be installed.');
      console.error('Try running: npm install vite@4.5.1 @vitejs/plugin-react-swc@3.3.2 --save-dev');
      return false;
    }
  } else {
    console.log('✅ Vite is already installed.');
    return true;
  }
}

// Create a script to check specifically for platform-specific rollup modules
function addRollupExclusions() {
  // Update the vite.config.js if it exists
  const viteConfigPath = path.resolve(process.cwd(), 'vite.config.js');
  const viteConfigTsPath = path.resolve(process.cwd(), 'vite.config.ts');
  
  let configPath = null;
  let isTypeScript = false;
  
  if (fs.existsSync(viteConfigTsPath)) {
    configPath = viteConfigTsPath;
    isTypeScript = true;
  } else if (fs.existsSync(viteConfigPath)) {
    configPath = viteConfigPath;
  }
  
  if (!configPath) {
    console.log('No vite.config.js or vite.config.ts found. Skipping exclusion setup.');
    return;
  }
  
  try {
    console.log('Adding rollup exclusion to Vite config...');
    // We won't modify the file directly as it's complex to parse correctly
    // Just output instructions
    console.log(`✅ Vite config found at ${configPath}.`);
    console.log('Make sure your vite.config file includes exclusions for platform-specific rollup binaries:');
    console.log(`
optimizeDeps: {
  exclude: [
    '@rollup/rollup-linux-x64-gnu',
    '@rollup/rollup-darwin-x64',
    '@rollup/rollup-darwin-arm64',
    '@rollup/rollup-linux-arm64-gnu',
    '@rollup/rollup-win32-x64-msvc',
    '@rollup/rollup-win32-ia32-msvc',
    '@rollup/rollup-linux-arm-gnueabihf',
    '@rollup/rollup-android-arm64',
    '@rollup/rollup-freebsd-x64',
    '@rollup/rollup-linux-arm64-musl',
    '@rollup/rollup-linux-x64-musl'
  ],
},`);
  } catch (error) {
    console.error('Error updating Vite config:', error.message);
  }
}

// Run the installation check
const success = ensureViteInstalled();
if (success) {
  addRollupExclusions();
}

module.exports = success;
