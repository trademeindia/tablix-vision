
#!/usr/bin/env node

// Script to make shell scripts executable
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const files = [
  'start-dev.js',
  'update-scripts.js',
  'src/utils/start-app.js',
  'src/utils/ensure-vite.js'
];

try {
  console.log('Making scripts executable...');
  
  files.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    
    if (fs.existsSync(filePath)) {
      if (process.platform !== 'win32') {
        // For Unix-based systems, use chmod
        exec(`chmod +x ${filePath}`, (error) => {
          if (error) {
            console.error(`Error making ${file} executable:`, error.message);
          } else {
            console.log(`Made ${file} executable.`);
          }
        });
      } else {
        console.log(`Skipping chmod for ${file} on Windows.`);
      }
    } else {
      console.warn(`File not found: ${file}`);
    }
  });
  
  console.log('Script execution complete.');
} catch (error) {
  console.error('Error making scripts executable:', error.message);
}
