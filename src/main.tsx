
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';
import { initializeSupabase } from '@/utils/supabase-init';

// Initialize Supabase when the app starts
initializeSupabase().catch(err => {
  console.error('Failed to initialize Supabase:', err);
});

// Log information about the environment
console.log('Initializing application...');
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
