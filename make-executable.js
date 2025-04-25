
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Making startup scripts executable...');

const files = [
  'start.js',
  'src/utils/start-app.js',
  'src/utils/update-scripts.js',
  'src/utils/ensure-executable.js'
];

// Only needed on Unix-based systems
if (process.platform !== 'win32') {
  files.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    
    if (fs.existsSync(filePath)) {
      try {
        fs.chmodSync(filePath, '755');
        console.log(`Made ${file} executable`);
      } catch (error) {
        console.error(`Error making ${file} executable:`, error.message);
      }
    } else {
      console.warn(`File not found: ${file}`);
    }
  });
}

console.log('Script execution complete, you can now run: node start.js');
