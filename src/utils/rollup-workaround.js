
#!/usr/bin/env node

/**
 * This script creates dummy packages for missing Rollup platform dependencies
 * to avoid the "Cannot find module @rollup/rollup-linux-x64-gnu" error
 */

const fs = require('fs');
const path = require('path');

function createDummyRollupPlatformFiles() {
  console.log('Setting up Rollup platform dependency workarounds...');
  
  try {
    // Directory where the platform-specific packages should be
    const rollupDir = path.join(__dirname, '..', '..', 'node_modules', '@rollup');
    
    // Create @rollup directory if it doesn't exist
    if (!fs.existsSync(rollupDir)) {
      console.log('Creating @rollup directory...');
      try {
        fs.mkdirSync(rollupDir, { recursive: true });
      } catch (err) {
        console.error('Failed to create @rollup directory:', err.message);
        return false;
      }
    }
    
    // List of Rollup platform-specific packages
    const platformPackages = [
      'rollup-linux-x64-gnu',
      'rollup-linux-x64-musl',
      'rollup-darwin-x64',
      'rollup-darwin-arm64',
      'rollup-win32-x64-msvc',
      'rollup-win32-ia32-msvc',
      'rollup-win32-arm64-msvc',
      'rollup-linux-arm64-gnu',
      'rollup-linux-arm64-musl',
      'rollup-linux-arm-gnueabihf',
      'rollup-android-arm64',
      'rollup-android-arm-eabi',
      'rollup-freebsd-x64',
      'rollup-linux-ia32-gnu',
      'rollup-linux-ia32-musl',
      'rollup-sunos-x64',
      'rollup-linux-riscv64-gnu'
    ];
    
    // Create dummy package.json and index.js for each platform package
    for (const pkg of platformPackages) {
      const pkgDir = path.join(rollupDir, pkg);
      const pkgJsonPath = path.join(pkgDir, 'package.json');
      const indexJsPath = path.join(pkgDir, 'index.js');
      
      // Create directory
      if (!fs.existsSync(pkgDir)) {
        try {
          fs.mkdirSync(pkgDir, { recursive: true });
          console.log(`Created directory for ${pkg}`);
        } catch (err) {
          console.error(`Failed to create directory for ${pkg}:`, err.message);
          continue;
        }
      }
      
      // Create package.json
      if (!fs.existsSync(pkgJsonPath)) {
        try {
          fs.writeFileSync(pkgJsonPath, JSON.stringify({
            name: `@rollup/${pkg}`,
            version: '4.9.0', // Use consistent version
            description: 'Dummy package to satisfy Rollup dependencies',
            main: 'index.js'
          }, null, 2));
          console.log(`Created package.json for ${pkg}`);
        } catch (err) {
          console.error(`Failed to create package.json for ${pkg}:`, err.message);
        }
      }
      
      // Create index.js
      if (!fs.existsSync(indexJsPath)) {
        try {
          fs.writeFileSync(indexJsPath, `
// Dummy module for ${pkg}
module.exports = {
  isSupported: false,
  getNativeModule: () => null
};`);
          console.log(`Created index.js for ${pkg}`);
        } catch (err) {
          console.error(`Failed to create index.js for ${pkg}:`, err.message);
        }
      }
    }
    
    console.log('Rollup platform dependency workaround setup complete.');
    return true;
  } catch (error) {
    console.error('Error in Rollup workaround setup:', error);
    return false;
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  const success = createDummyRollupPlatformFiles();
  process.exit(success ? 0 : 1);
}

module.exports = { createDummyRollupPlatformFiles };
