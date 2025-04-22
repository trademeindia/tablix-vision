
#!/usr/bin/env node

// Update the package.json scripts without modifying the file directly
const fs = require('fs');
const path = require('path');

// First run the vite installation script
require('./install-vite.js');

// Now simply generate a command that the user can run to update scripts
console.log('\n\nTo update your package.json scripts, run the following command:');
console.log('\nnpm pkg set "scripts.dev=node src/utils/install-vite.js && vite" "scripts.build=vite build" "scripts.preview=vite preview"\n');
console.log('After running this command, you should be able to start the development server with: npm run dev');
