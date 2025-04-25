
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('===== Vite Installation Diagnosis =====');

// Check Node.js version
console.log(`Node.js version: ${process.version}`);

// Check if package.json exists and contains vite
try {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
  console.log('package.json found');
  
  const hasViteDep = packageJson.dependencies && packageJson.dependencies.vite;
  const hasViteDevDep = packageJson.devDependencies && packageJson.devDependencies.vite;
  
  console.log(`Vite in dependencies: ${hasViteDep ? 'Yes' : 'No'}`);
  console.log(`Vite in devDependencies: ${hasViteDevDep ? 'Yes' : 'No'}`);
} catch (error) {
  console.error('Error reading package.json:', error.message);
}

// Check PATH environment variable
console.log(`PATH: ${process.env.PATH}`);

// Check for the Vite config file
try {
  const viteConfigPath = path.resolve(process.cwd(), 'vite.config.ts');
  const viteConfigExists = fs.existsSync(viteConfigPath);
  console.log(`vite.config.ts exists: ${viteConfigExists ? 'Yes' : 'No'}`);
  
  if (viteConfigExists) {
    const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    console.log('Checking vite.config.ts for Rollup exclusions:');
    const hasExclusions = viteConfig.includes('@rollup/rollup-linux-x64-gnu');
    console.log(`  Has Rollup exclusions: ${hasExclusions ? 'Yes' : 'No'}`);
  }
} catch (error) {
  console.error('Error checking vite.config.ts:', error.message);
}

console.log('===== End of Diagnosis =====');
console.log('To start the development server with Rollup workarounds, run:');
console.log('  node start-dev.js');
