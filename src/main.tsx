
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
console.log('main.tsx is executing');
import { initializeSupabase } from '@/utils/supabase-init';

// Enhanced error handling to prevent Chrome extension errors from affecting our app
window.addEventListener('error', (event) => {
  // Check if the error is from a Chrome extension
  if (event.filename && event.filename.includes('chrome-extension://')) {
    // Specifically look for Solana extension errors
    if (event.filename.includes('solana.js') || event.message.includes('register') || event.message.includes('solana')) {
      console.warn('Suppressed Solana extension error:', event.message);
    } else {
      console.warn('Suppressed Chrome extension error:', event.message);
    }
    event.stopPropagation();
    event.preventDefault();
    return false;
  }
});

// Fix for potential extension script errors that might happen before our error handler is attached
document.addEventListener('DOMContentLoaded', () => {
  // Create a global error handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.stack && event.reason.stack.includes('chrome-extension://')) {
      console.warn('Suppressed unhandled Chrome extension promise rejection:', event.reason.message || 'Unknown error');
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
  
  // Special handling for Solana extension errors
  if (window.navigator && window.navigator.userAgent && window.navigator.userAgent.includes('Chrome')) {
    // Create a patch for common Solana extension issues
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = function(key) {
      try {
        return originalGetItem.call(localStorage, key);
      } catch (err) {
        console.warn('Suppressed localStorage error possibly from extension:', err);
        return null;
      }
    };
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
