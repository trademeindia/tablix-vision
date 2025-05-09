
#!/usr/bin/env node

// Script to start the development server with workarounds for Rollup platform dependencies
const { spawn } = require('child_process');

console.log('Starting development server with Rollup platform dependency workarounds...');

// First, run the rollup workaround script
try {
  require('./src/utils/rollup-workaround').createDummyRollupPlatformFiles();
  console.log('Rollup workarounds applied successfully');
} catch (err) {
  console.warn('Could not set up Rollup workarounds:', err.message);
}

// Set environment variables to avoid Rollup platform-specific issues
const env = {
  ...process.env,
  ROLLUP_SKIP_NORMALIZE: 'true',
  VITE_CJS_IGNORE_WARNING: 'true',
  NODE_OPTIONS: '--experimental-modules --no-warnings',
  ROLLUP_WATCH_IGNORE: '@rollup/rollup-linux-x64-gnu,@rollup/rollup-linux-x64-musl,@rollup/rollup-darwin-x64,@rollup/rollup-darwin-arm64,@rollup/rollup-win32-x64-msvc,@rollup/rollup-win32-ia32-msvc,@rollup/rollup-win32-arm64-msvc,@rollup/rollup-linux-arm64-gnu,@rollup/rollup-linux-arm64-musl,@rollup/rollup-linux-arm-gnueabihf,@rollup/rollup-android-arm64,@rollup/rollup-android-arm-eabi,@rollup/rollup-freebsd-x64,@rollup/rollup-linux-ia32-gnu,@rollup/rollup-linux-ia32-musl,@rollup/rollup-sunos-x64,@rollup/rollup-linux-riscv64-gnu'
};

// Start Vite
const viteProcess = spawn(
  'npx',
  ['vite'],
  { stdio: 'inherit', shell: true, env }
);

viteProcess.on('error', (err) => {
  console.error('Failed to start Vite:', err.message);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`Vite process exited with code ${code}`);
  }
  process.exit(code);
});
