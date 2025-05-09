
#!/usr/bin/env node

// Enhanced start script that applies all needed workarounds
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting with enhanced Rollup platform dependency workarounds...');

// Ensure the rollup-workaround.js script is executable (Unix only)
if (process.platform !== 'win32') {
  try {
    fs.chmodSync(path.join(__dirname, 'src/utils/rollup-workaround.js'), '755');
    console.log('Made rollup-workaround.js executable');
  } catch (err) {
    console.warn('Warning: Could not make rollup-workaround.js executable:', err.message);
  }
}

// Apply the Rollup workaround
try {
  console.log('Applying Rollup platform dependency workarounds...');
  require('./src/utils/rollup-workaround').createDummyRollupPlatformFiles();
  console.log('Rollup workarounds successfully applied');
} catch (err) {
  console.error('Failed to apply Rollup workarounds:', err.message);
  console.warn('Continuing anyway, but build may fail...');
}

// Set up environment variables to bypass platform-specific Rollup issues
const env = {
  ...process.env,
  ROLLUP_SKIP_NORMALIZE: 'true',
  VITE_CJS_IGNORE_WARNING: 'true',
  NODE_OPTIONS: '--no-warnings',
  FORCE_COLOR: '1', // Enable color output in terminals
  // Add explicit ignore pattern for platform-specific packages
  ROLLUP_WATCH_IGNORE: '@rollup/rollup-linux-x64-gnu,@rollup/rollup-linux-x64-musl,@rollup/rollup-darwin-x64,@rollup/rollup-darwin-arm64,@rollup/rollup-win32-x64-msvc,@rollup/rollup-win32-ia32-msvc,@rollup/rollup-win32-arm64-msvc,@rollup/rollup-linux-arm64-gnu,@rollup/rollup-linux-arm64-musl,@rollup/rollup-linux-arm-gnueabihf,@rollup/rollup-android-arm64,@rollup/rollup-android-arm-eabi,@rollup/rollup-freebsd-x64,@rollup/rollup-linux-ia32-gnu,@rollup/rollup-linux-ia32-musl,@rollup/rollup-sunos-x64,@rollup/rollup-linux-riscv64-gnu'
};

// Determine which mode to run based on command line arguments
const args = process.argv.slice(2);
const mode = args[0] || 'dev';  // Default to dev mode if not specified
const viteArgs = mode === 'dev' ? [] : [mode];

console.log(`Starting Vite in '${mode}' mode...`);

// Try multiple ways to start Vite
function startVite() {
  const localVitePath = path.join(__dirname, 'node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');
  
  if (fs.existsSync(localVitePath)) {
    console.log('Using local Vite binary');
    const viteProcess = spawn(localVitePath, viteArgs, { stdio: 'inherit', env, shell: true });
    
    viteProcess.on('error', (err) => {
      console.error('Error running local Vite binary:', err.message);
      tryNpx();
    });
    
    viteProcess.on('close', (code) => {
      if (code !== 0) {
        console.log(`Vite exited with code ${code}`);
        process.exit(code || 1);
      }
      process.exit(0);
    });
  } else {
    tryNpx();
  }
}

function tryNpx() {
  console.log('Falling back to npx vite...');
  
  try {
    const npxProcess = spawn('npx', ['vite', ...viteArgs], { stdio: 'inherit', env, shell: true });
    
    npxProcess.on('error', (err) => {
      console.error('Error running npx vite:', err.message);
      tryNodeVite();
    });
    
    npxProcess.on('close', (code) => {
      if (code !== 0) {
        console.log(`npx vite exited with code ${code}`);
        tryNodeVite();
        return;
      }
      process.exit(0);
    });
  } catch (err) {
    console.error('Failed to start with npx:', err.message);
    tryNodeVite();
  }
}

function tryNodeVite() {
  console.log('Falling back to node node_modules/vite/bin/vite.js...');
  const vitePath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  
  if (fs.existsSync(vitePath)) {
    try {
      const nodeProcess = spawn('node', [vitePath, ...viteArgs], { stdio: 'inherit', env, shell: true });
      
      nodeProcess.on('error', (err) => {
        console.error('All attempts to start Vite failed:', err.message);
        process.exit(1);
      });
      
      nodeProcess.on('close', (code) => {
        process.exit(code || 0);
      });
    } catch (err) {
      console.error('Failed to start with node directly:', err.message);
      process.exit(1);
    }
  } else {
    console.error('Could not find Vite binary or script. All options exhausted.');
    process.exit(1);
  }
}

// Make this script executable (Unix only)
if (process.platform !== 'win32') {
  try {
    fs.chmodSync(__filename, '755');
  } catch (err) {
    console.warn('Warning: Could not make script executable:', err.message);
  }
}

// Start Vite with our best-effort approach
startVite();
