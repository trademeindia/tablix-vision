
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeSupabase } from '@/utils/supabase-init';

// Initialize Supabase when the app starts
(async () => {
  try {
    await initializeSupabase();
    // console.log('Supabase initialized successfully');
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
  }
})();

// Log information about the environment
// console.log('Initializing application...');
// console.log('Environment:', import.meta.env.MODE);
// console.log('Base URL:', import.meta.env.BASE_URL);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// TODO: Integrate HelmetProvider once type issues are resolved
createRoot(rootElement).render(<App />);
