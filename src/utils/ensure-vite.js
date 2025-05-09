
#!/usr/bin/env node

// Helper script to ensure Vite is installed correctly
try {
  // First, try to create workarounds for the Rollup platform dependencies issue
  try {
    require('./rollup-workaround').createDummyRollupPlatformFiles();
    console.log('Rollup workarounds applied successfully');
  } catch (err) {
    console.warn('Could not set up Rollup workarounds:', err.message);
  }
  
  // Check if Vite is available
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
} catch (generalError) {
  console.error('Unexpected error ensuring Vite:', generalError);
  process.exit(1);
}
