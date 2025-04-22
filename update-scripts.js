
#!/usr/bin/env node

// Script to update package.json scripts
const { spawnSync } = require('child_process');

console.log('Updating package.json scripts...');

// Update the scripts
spawnSync('npm', ['pkg', 'set', 'scripts.dev=node start-vite.js'], {
  stdio: 'inherit',
  shell: true
});

spawnSync('npm', ['pkg', 'set', 'scripts.build=npx vite build'], {
  stdio: 'inherit',
  shell: true
});

spawnSync('npm', ['pkg', 'set', 'scripts.preview=npx vite preview'], {
  stdio: 'inherit',
  shell: true
});

console.log('Package.json scripts updated successfully.');
console.log('You can now run "npm run dev" to start the development server.');
