
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
    const fullPath = path.resolve(process.cwd(), scriptPath);
    
    try {
      if (fs.existsSync(fullPath)) {
        fs.chmodSync(fullPath, '755');
        console.log(`Made ${scriptPath} executable`);
      }
    } catch (err) {
      console.warn(`Warning: Could not make ${scriptPath} executable:`, err.message);
    }
  });
}
