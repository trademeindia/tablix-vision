
#!/usr/bin/env node

// Script to handle starting the app with Rollup platform dependency workarounds
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting application with platform dependency workarounds...');

// Ensure our scripts are executable (Unix only)
if (process.platform !== 'win32') {
  try {
    fs.chmodSync(__filename, '755');
    console.log('Made this script executable');
    
    const scriptPaths = [
      path.join(__dirname, 'src/utils/install-vite.js'),
      path.join(__dirname, 'src/utils/ensure-vite.js'),
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

// Run the Vite installation script to ensure Vite is available
try {
  require('./src/utils/install-vite.js');
} catch (err) {
  console.warn('Error running install-vite.js:', err.message);
}

// Set up environment variables to bypass platform-specific Rollup issues
const env = {
  ...process.env,
  ROLLUP_SKIP_NORMALIZE: 'true',
  VITE_CJS_IGNORE_WARNING: 'true',
  NODE_OPTIONS: '--no-warnings'
};

// Determine which command to run based on arguments
const command = process.argv[2] || 'dev';

let viteArgs = ['vite'];
if (command === 'build') {
  viteArgs.push('build');
} else if (command === 'preview') {
  viteArgs.push('preview');
}

console.log(`Running vite in '${command}' mode...`);

// Try to start Vite using npx for maximum compatibility
const viteProcess = spawn('npx', viteArgs, {
  stdio: 'inherit',
  shell: true,
  env
});

viteProcess.on('error', (err) => {
  console.error('Failed to start Vite with npx:', err.message);
  
  // Fallback to direct node execution
  console.log('Attempting fallback to direct execution...');
  const nodeProcess = spawn(
    'node',
    ['node_modules/vite/bin/vite.js', ...(command !== 'dev' ? [command] : [])],
    { stdio: 'inherit', shell: true, env }
  );
  
  nodeProcess.on('error', (nodeErr) => {
    console.error('All attempts to run Vite failed:', nodeErr.message);
    process.exit(1);
  });
});

viteProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`Vite process exited with code ${code}`);
  }
  process.exit(code);
});
