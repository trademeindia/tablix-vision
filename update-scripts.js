
#!/usr/bin/env node

// Script to update package.json scripts
const fs = require('fs');
const path = require('path');

try {
  console.log('Updating package.json scripts...');
  
  // Read package.json
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Update scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    "dev": "node start-dev.js",
    "build": "echo 'Build process for Lovable'",
    "preview": "node src/utils/start-app.js"
  };
  
  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log('Package.json scripts updated successfully!');
  console.log('You can now run "npm run dev" to start the development server.');
} catch (error) {
  console.error('Error updating package.json:', error.message);
}
