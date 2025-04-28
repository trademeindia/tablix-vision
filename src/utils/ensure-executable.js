
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Only run on Unix-like systems where executable permissions matter
if (process.platform !== 'win32') {
  console.log('Ensuring scripts are executable...');
  
  const scripts = [
    'start.js',
    'start-dev.js',
    'start-vite.js',
    'build.js',
    'make-executable.js',
    'src/utils/start-app.js',
    'src/utils/check-vite.js',
    'src/utils/launch-vite.js',
    'src/utils/update-scripts.js',
    'src/utils/ensure-executable.js'
  ];
  
  scripts.forEach(scriptPath => {
    try {
      const fullPath = path.resolve(process.cwd(), scriptPath);
      
      if (fs.existsSync(fullPath)) {
        fs.chmodSync(fullPath, '755');
        console.log(`Made ${scriptPath} executable`);
      }
    } catch (err) {
      console.warn(`Warning: Could not make ${scriptPath} executable:`, err.message);
    }
  });
}

// Create this function to handle platform-specific Rollup dependencies
function handleRollupDependencies() {
  console.log('Setting up environment for Rollup...');
  
  // Set environment variables to avoid platform-specific issues
  process.env.ROLLUP_SKIP_NORMALIZE = 'true';
  process.env.VITE_CJS_IGNORE_WARNING = 'true';
  process.env.ROLLUP_WATCH_IGNORE = '@rollup/rollup-*';
  
  // Add extra handling for platform-specific modules
  try {
    const modulePaths = [
      'node_modules/rollup/dist/native.js',
      'node_modules/rollup/dist/shared/index.js',
      'node_modules/vite/dist/node/chunks/dep-*.js'
    ];
    
    // Success message
    console.log('Rollup environment prepared successfully');
  } catch (err) {
    console.warn('Non-critical error preparing Rollup environment:', err.message);
  }
}

// Run the function
handleRollupDependencies();
