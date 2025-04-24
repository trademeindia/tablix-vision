
#!/usr/bin/env node

// Script to diagnose Vite installation issues and help with troubleshooting
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Print out the current working directory and environment info
console.log('\n===== VITE INSTALLATION DIAGNOSIS =====');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Current working directory:', process.cwd());

// Check if node_modules exists
const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
console.log('\nChecking for node_modules at:', nodeModulesPath);

if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules directory exists');
  
  // Check if it's empty or has files
  try {
    const files = fs.readdirSync(nodeModulesPath);
    console.log(`   Contains ${files.length} entries`);
  } catch (err) {
    console.log('❌ Error reading node_modules:', err.message);
  }
} else {
  console.log('❌ node_modules directory does NOT exist');
  console.log('   Run "npm install" or "yarn" to install dependencies');
}

// Check for package.json
const packageJsonPath = path.resolve(process.cwd(), 'package.json');
console.log('\nChecking for package.json at:', packageJsonPath);

if (fs.existsSync(packageJsonPath)) {
  console.log('✅ package.json exists');
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log('   Dependencies:', Object.keys(packageJson.dependencies || {}).length);
    console.log('   DevDependencies:', Object.keys(packageJson.devDependencies || {}).length);
    
    // Check for vite in dependencies
    const hasDeps = packageJson.dependencies && packageJson.dependencies.vite;
    const hasDevDeps = packageJson.devDependencies && packageJson.devDependencies.vite;
    
    if (hasDeps || hasDevDeps) {
      console.log('✅ Vite found in package.json', hasDeps ? 'dependencies' : 'devDependencies');
    } else {
      console.log('❌ Vite NOT found in package.json');
    }
  } catch (err) {
    console.log('❌ Error reading package.json:', err.message);
  }
} else {
  console.log('❌ package.json does NOT exist');
}

// Check for Vite in potential locations
const potentialPaths = [
  path.resolve(process.cwd(), 'node_modules', '.bin', 'vite'),
  path.resolve(process.cwd(), 'node_modules', '.bin', 'vite.cmd'), // Windows
  path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js'),
  path.resolve(process.cwd(), 'node_modules', 'vite', 'package.json')
];

console.log('\nChecking for Vite in potential locations:');
potentialPaths.forEach(p => {
  const exists = fs.existsSync(p);
  console.log(`- ${p}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
  if (exists && p.endsWith('package.json')) {
    try {
      const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
      console.log(`  Installed Vite version: ${pkg.version}`);
    } catch (err) {
      console.log(`  Error reading Vite package.json: ${err.message}`);
    }
  }
});

// Check Vite version by running it
console.log('\nTrying to run Vite:');
try {
  const viteProcess = spawn('npx', ['vite', '--version'], {
    stdio: 'pipe',
    shell: true
  });
  
  let output = '';
  viteProcess.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  let errorOutput = '';
  viteProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });
  
  viteProcess.on('close', (code) => {
    if (code === 0 && output.trim()) {
      console.log(`✅ Successfully ran Vite: version ${output.trim()}`);
      console.log('\n✅ DIAGNOSIS: Vite appears to be properly installed.');
    } else {
      console.log(`❌ Failed to run Vite. Exit code: ${code}`);
      if (errorOutput) {
        console.log('   Error output:', errorOutput.trim());
      }
      console.log('\n❌ DIAGNOSIS: Vite is not properly installed or accessible.');
    }
    
    // Provide next steps
    console.log('\n📋 RECOMMENDED STEPS:');
    console.log('1. Run: npm install vite@latest --save-dev');
    console.log('2. Try the development server with: node start-dev.js');
    console.log('3. Build the project with: node build.js');
    console.log('4. If issues persist:');
    console.log('   - Delete node_modules directory and package-lock.json');
    console.log('   - Run npm install again');
    console.log('   - Try npm exec vite to check global availability');
  });
} catch (err) {
  console.error('❌ Error running Vite check:', err.message);
}
