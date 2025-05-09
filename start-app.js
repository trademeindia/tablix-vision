
#!/usr/bin/env node

// Script to handle starting the app with Rollup platform dependency workarounds
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting application with platform dependency workarounds...');

// First, run the rollup workaround script
try {
  require('./src/utils/rollup-workaround').createDummyRollupPlatformFiles();
  console.log('Rollup workarounds applied successfully');
} catch (err) {
  console.warn('Could not set up Rollup workarounds:', err.message);
}

// Ensure our scripts are executable (Unix only)
if (process.platform !== 'win32') {
  try {
    fs.chmodSync(__filename, '755');
    console.log('Made this script executable');
    
    const scriptPaths = [
      path.join(__dirname, 'src/utils/rollup-workaround.js'),
      path.join(__dirname, 'src/utils/ensure-vite.js'),
      path.join(__dirname, 'src/utils/install-vite.js'),
    ];
    
    scriptPaths.forEach(scriptPath => {
      if (fs.existsSync(scriptPath)) {
        fs.chmodSync(scriptPath, '755');
        console.log(`Made ${scriptPath} executable`);
      }
    });
  } catch (err) {
    console.warn('Warning: Could not make scripts executable:', err.message);
  }
}

// Set up environment variables to bypass platform-specific Rollup issues
const env = {
  ...process.env,
  ROLLUP_SKIP_NORMALIZE: 'true',
  VITE_CJS_IGNORE_WARNING: 'true',
  NODE_OPTIONS: '--no-warnings',
  ROLLUP_WATCH_IGNORE: '@rollup/rollup-linux-x64-gnu,@rollup/rollup-linux-x64-musl,@rollup/rollup-darwin-x64,@rollup/rollup-darwin-arm64,@rollup/rollup-win32-x64-msvc,@rollup/rollup-win32-ia32-msvc,@rollup/rollup-win32-arm64-msvc,@rollup/rollup-linux-arm64-gnu,@rollup/rollup-linux-arm64-musl,@rollup/rollup-linux-arm-gnueabihf,@rollup/rollup-android-arm64,@rollup/rollup-android-arm-eabi,@rollup/rollup-freebsd-x64,@rollup/rollup-linux-ia32-gnu,@rollup/rollup-linux-ia32-musl,@rollup/rollup-sunos-x64,@rollup/rollup-linux-riscv64-gnu'
};

// Determine which command to run based on arguments
const args = process.argv.slice(2);
const command = args.length > 0 ? args[0] : 'dev';

console.log(`Running vite in '${command}' mode...`);

// Try multiple approaches to run Vite, starting with the most direct ones
// Define the runVite function
const runVite = () => {
  // Try using the local vite binary directly first
  const localVitePath = path.join(__dirname, 'node_modules', '.bin', 
    process.platform === 'win32' ? 'vite.cmd' : 'vite');
  
  if (fs.existsSync(localVitePath)) {
    console.log('Using local Vite binary:', localVitePath);
    
    const viteProcess = spawn(
      localVitePath,
      command !== 'dev' ? [command] : [],
      { stdio: 'inherit', shell: true, env }
    );
    
    viteProcess.on('error', fallbackToNpx);
    viteProcess.on('close', (code) => process.exit(code || 0));
    
    return;
  }
  
  // Try using node to run Vite directly
  const viteJsPath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  
  if (fs.existsSync(viteJsPath)) {
    console.log('Using Vite JS file directly:', viteJsPath);
    
    const nodeProcess = spawn(
      'node',
      [viteJsPath, ...(command !== 'dev' ? [command] : [])],
      { stdio: 'inherit', shell: true, env }
    );
    
    nodeProcess.on('error', fallbackToNpx);
    nodeProcess.on('close', (code) => process.exit(code || 0));
    
    return;
  }
  
  // If direct approaches failed, try npx
  fallbackToNpx();
};

// Define the fallback function
const fallbackToNpx = (err) => {
  if (err) {
    console.error('Failed to start Vite directly:', err.message);
  }
  
  console.log('Falling back to npx vite...');
  
  const npxProcess = spawn(
    'npx',
    ['vite', ...(command !== 'dev' ? [command] : [])],
    { stdio: 'inherit', shell: true, env }
  );
  
  npxProcess.on('error', (npxErr) => {
    console.error('All attempts to run Vite failed:', npxErr.message);
    process.exit(1);
  });
  
  npxProcess.on('close', (code) => process.exit(code || 0));
};

// Start Vite using our strategy
runVite();
