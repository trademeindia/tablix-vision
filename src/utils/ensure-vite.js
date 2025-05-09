
#!/usr/bin/env node

// Helper script to ensure Vite is installed correctly
try {
  require.resolve('vite');
  console.log('Vite is installed correctly');
  process.exit(0);
} catch (e) {
  console.error('Vite is not installed correctly. Attempting to install...');
  
  try {
    // For the purpose of this helper, we'll call the install script
    require('./install-vite.js');
    console.log('Vite install script executed successfully');
    process.exit(0);
  } catch (installError) {
    console.error('Failed to install Vite:', installError);
    process.exit(1);
  }
}
