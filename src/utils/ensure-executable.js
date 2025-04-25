
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Ensuring scripts are executable...');

// Make necessary scripts executable
const filesToMakeExecutable = [
  'start.js',
  'src/utils/start-app.js',
  'src/utils/ensure-executable.js'
];

// Only needed on Unix-based systems
if (process.platform !== 'win32') {
  filesToMakeExecutable.forEach(file => {
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

console.log('Scripts are now executable');
