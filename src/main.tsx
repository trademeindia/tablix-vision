
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';
import { initializeSupabase } from '@/utils/supabase-init';

// Initialize Supabase when the app starts
initializeSupabase().catch(err => {
  console.error('Failed to initialize Supabase:', err);
});

// Log information about the environment and Vite status
console.log('Initializing application...');
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);

// Add analytics and performance tools in non-development environments
if (import.meta.env.MODE !== 'development') {
  // Add performance mark to track initial load time
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('app-init-start');
  }
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// Record app initialization complete
if (import.meta.env.MODE !== 'development') {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('app-init-complete');
    performance.measure('app-initialization', 'app-init-start', 'app-init-complete');
    
    // Log performance metrics
    const appInitMeasure = performance.getEntriesByName('app-initialization')[0];
    console.log(`App initialization completed in ${appInitMeasure.duration.toFixed(2)}ms`);
  }
}
