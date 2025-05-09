
#!/usr/bin/env node

// Script to build the project using Vite with enhanced error handling
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log current working directory for debugging
console.log('Current working directory:', process.cwd());

// First, apply the Rollup workarounds
try {
  require('./src/utils/rollup-workaround').createDummyRollupPlatformFiles();
  console.log('Rollup workarounds applied successfully');
} catch (err) {
  console.warn('Could not set up Rollup workarounds:', err.message);
}

// Set up environment variables to bypass platform-specific Rollup issues
const env = {
  ...process.env,
  ROLLUP_SKIP_NORMALIZE: 'true',
  VITE_CJS_IGNORE_WARNING: 'true',
  NODE_OPTIONS: '--no-warnings',
  ROLLUP_WATCH_IGNORE: '@rollup/rollup-linux-x64-gnu,@rollup/rollup-linux-x64-musl,@rollup/rollup-darwin-x64,@rollup/rollup-darwin-arm64,@rollup/rollup-win32-x64-msvc,@rollup/rollup-win32-ia32-msvc,@rollup/rollup-win32-arm64-msvc,@rollup/rollup-linux-arm64-gnu,@rollup/rollup-linux-arm64-musl,@rollup/rollup-linux-arm-gnueabihf,@rollup/rollup-android-arm64,@rollup/rollup-android-arm-eabi,@rollup/rollup-freebsd-x64,@rollup/rollup-linux-ia32-gnu,@rollup/rollup-linux-ia32-musl,@rollup/rollup-sunos-x64,@rollup/rollup-linux-riscv64-gnu'
};

// Ensure Vite is installed before attempting to build
try {
  console.log('Ensuring Vite is installed...');
  require('./src/utils/ensure-vite');
  
  console.log('Building project...');
  
  // Try using the local vite binary directly first
  const localVitePath = path.join(__dirname, 'node_modules', '.bin', 
    process.platform === 'win32' ? 'vite.cmd' : 'vite');
    
  if (fs.existsSync(localVitePath)) {
    console.log('Using local Vite binary:', localVitePath);
    
    const viteProcess = spawn(
      localVitePath,
      ['build'],
      { stdio: 'inherit', shell: true, env }
    );
    
    viteProcess.on('error', fallbackToNpx);
    viteProcess.on('close', (code) => process.exit(code || 0));
  } else {
    fallbackToNpx();
  }
  
  function fallbackToNpx(err) {
    if (err) {
      console.error('Failed to build with local Vite:', err.message);
    }
    
    console.log('Falling back to npx vite build...');
    
    const npxProcess = spawn(
      'npx',
      ['vite', 'build'],
      { stdio: 'inherit', shell: true, env }
    );
    
    npxProcess.on('error', (npxErr) => {
      console.error('All attempts to build with Vite failed:', npxErr.message);
      process.exit(1);
    });
    
    npxProcess.on('close', (code) => process.exit(code || 0));
  }
} catch (error) {
  console.error('Error building project:', error.message);
  process.exit(1);
}
