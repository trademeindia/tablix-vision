
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
console.log('main.tsx is executing');
import { initializeSupabase } from '@/utils/supabase-init';

// Error handling to prevent Chrome extension errors from affecting our app
window.addEventListener('error', (event) => {
  // Check if the error is from a Chrome extension
  if (event.filename && event.filename.includes('chrome-extension://')) {
    console.warn('Suppressed Chrome extension error:', event.message);
    event.stopPropagation();
    event.preventDefault();
    return false;
  }
});

// Initialize Supabase when the app starts
(async () => {
  try {
    await initializeSupabase();
    // console.log('Supabase initialized successfully');
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
  }
})();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create root with App component
createRoot(rootElement).render(<App />);
