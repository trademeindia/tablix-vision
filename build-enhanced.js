
#!/usr/bin/env node

// Enhanced build script with Rollup platform dependency workarounds
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build with enhanced Rollup platform dependency workarounds...');

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
  NODE_OPTIONS: '--max-old-space-size=4096 --no-warnings', // Increased memory limit
  FORCE_COLOR: '1', // Enable color output in terminals
  // Add explicit ignore pattern for platform-specific packages
  ROLLUP_WATCH_IGNORE: '@rollup/rollup-linux-x64-gnu,@rollup/rollup-linux-x64-musl,@rollup/rollup-darwin-x64,@rollup/rollup-darwin-arm64,@rollup/rollup-win32-x64-msvc,@rollup/rollup-win32-ia32-msvc,@rollup/rollup-win32-arm64-msvc,@rollup/rollup-linux-arm64-gnu,@rollup/rollup-linux-arm64-musl,@rollup/rollup-linux-arm-gnueabihf,@rollup/rollup-android-arm64,@rollup/rollup-android-arm-eabi,@rollup/rollup-freebsd-x64,@rollup/rollup-linux-ia32-gnu,@rollup/rollup-linux-ia32-musl,@rollup/rollup-sunos-x64,@rollup/rollup-linux-riscv64-gnu'
};

// Build mode (production by default)
const args = process.argv.slice(2);
const mode = args[0] || 'production';
console.log(`Building in ${mode} mode...`);

// Try multiple ways to build
function buildWithVite() {
  const localVitePath = path.join(__dirname, 'node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');
  
  if (fs.existsSync(localVitePath)) {
    console.log('Using local Vite binary');
    const viteProcess = spawn(localVitePath, ['build', '--mode', mode], { stdio: 'inherit', env, shell: true });
    
    viteProcess.on('error', (err) => {
      console.error('Error running local Vite binary:', err.message);
      buildWithNpx();
    });
    
    viteProcess.on('close', (code) => {
      if (code !== 0) {
        console.log(`Vite build exited with code ${code}`);
        process.exit(code || 1);
      }
      process.exit(0);
    });
  } else {
    buildWithNpx();
  }
}

function buildWithNpx() {
  console.log('Falling back to npx vite build...');
  
  try {
    const npxProcess = spawn('npx', ['vite', 'build', '--mode', mode], { stdio: 'inherit', env, shell: true });
    
    npxProcess.on('error', (err) => {
      console.error('Error running npx vite build:', err.message);
      buildWithNodeVite();
    });
    
    npxProcess.on('close', (code) => {
      if (code !== 0) {
        console.log(`npx vite build exited with code ${code}`);
        buildWithNodeVite();
        return;
      }
      process.exit(0);
    });
  } catch (err) {
    console.error('Failed to build with npx:', err.message);
    buildWithNodeVite();
  }
}

function buildWithNodeVite() {
  console.log('Falling back to node node_modules/vite/bin/vite.js build...');
  const vitePath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  
  if (fs.existsSync(vitePath)) {
    try {
      const nodeProcess = spawn('node', [vitePath, 'build', '--mode', mode], { stdio: 'inherit', env, shell: true });
      
      nodeProcess.on('error', (err) => {
        console.error('All attempts to build with Vite failed:', err.message);
        process.exit(1);
      });
      
      nodeProcess.on('close', (code) => {
        process.exit(code || 0);
      });
    } catch (err) {
      console.error('Failed to build with node directly:', err.message);
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

// Start the build process
buildWithVite();
