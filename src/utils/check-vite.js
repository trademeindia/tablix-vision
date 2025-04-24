
// Script to check Vite installation and provide diagnostic information
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('===== Vite Installation Diagnosis =====');

// Check Node.js version
console.log(`Node.js version: ${process.version}`);

// Check if we're in a development environment
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

// Check if package.json exists and contains vite
try {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
  console.log('package.json found');
  
  const hasViteDep = packageJson.dependencies && packageJson.dependencies.vite;
  const hasViteDevDep = packageJson.devDependencies && packageJson.devDependencies.vite;
  
  console.log(`Vite in dependencies: ${hasViteDep ? 'Yes' : 'No'}`);
  console.log(`Vite in devDependencies: ${hasViteDevDep ? 'Yes' : 'No'}`);
  
  // Check for vite scripts
  if (packageJson.scripts) {
    console.log('Scripts containing vite:');
    Object.entries(packageJson.scripts)
      .filter(([_, command]) => command.includes('vite'))
      .forEach(([name, command]) => {
        console.log(`  ${name}: ${command}`);
      });
  }
} catch (error) {
  console.error('Error reading package.json:', error.message);
}

// Try to resolve vite
try {
  const vitePath = require.resolve('vite');
  console.log(`Vite resolved at: ${vitePath}`);
} catch (error) {
  console.error('Failed to resolve vite:', error.message);
}

// Check PATH environment variable
console.log(`PATH: ${process.env.PATH}`);

// Check node_modules/.bin directory
const binPath = path.resolve(process.cwd(), 'node_modules', '.bin');
console.log(`Checking ${binPath}:`);
if (fs.existsSync(binPath)) {
  try {
    const files = fs.readdirSync(binPath);
    console.log(`Files in node_modules/.bin: ${files.join(', ')}`);
    console.log(`Vite binary exists: ${files.includes('vite') ? 'Yes' : 'No'}`);
  } catch (error) {
    console.error(`Error reading ${binPath}:`, error.message);
  }
} else {
  console.log(`${binPath} does not exist`);
}

// Try to run vite --version
try {
  console.log('Trying to run vite --version:');
  const viteVersion = execSync('node_modules/.bin/vite --version', { encoding: 'utf8' });
  console.log(`Vite version: ${viteVersion.trim()}`);
} catch (error) {
  console.error('Failed to run vite --version:', error.message);
}

console.log('===== End of Diagnosis =====');
console.log('If vite is not found, try running: npm install --save-dev vite @vitejs/plugin-react-swc');
