
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';
import { initializeSupabase } from '@/utils/supabase-init';

// Initialize Supabase when the app starts
initializeSupabase().catch(err => {
  console.error('Failed to initialize Supabase:', err);
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
