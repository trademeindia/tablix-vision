
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';
import { initializeSupabase } from '@/utils/supabase-init';

// Run the ensure-vite script if in development mode
if (import.meta.env.MODE === 'development') {
  try {
    // This is only for development environments
    // Using require directly instead of execSync
    console.log('Ensuring Vite is installed...');
    // Dynamically import the ensure-vite script (it will run automatically)
    import('../src/utils/ensure-vite.js')
      .catch(err => console.warn('Could not import ensure-vite script:', err));
  } catch (error) {
    console.warn('Could not run ensure-vite script:', error);
  }
}

// Initialize Supabase when the app starts
initializeSupabase().catch(err => {
  console.error('Failed to initialize Supabase:', err);
});

// Log information about the environment and Vite status
console.log('Initializing application...');
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
