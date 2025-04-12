// This is a fallback entry point in case the TypeScript version fails
import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.css';

// Simple fallback component
const FallbackApp = () => {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#0f766e' }}>
        Menu360
      </h1>
      <p style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '2rem' }}>
        The application is loading in fallback mode.
      </p>
      <p style={{ maxWidth: '600px', marginBottom: '2rem', color: '#555' }}>
        This could be happening due to TypeScript compilation issues.
        Try installing or reinstalling dependencies with: <br />
        <code style={{ backgroundColor: '#eee', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' }}>
          npm install
        </code>
      </p>
      <div>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            backgroundColor: '#0f766e',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.25rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          Reload Full Application
        </button>
        <a 
          href="/debug.html"
          style={{
            backgroundColor: '#e5e7eb',
            color: '#1f2937',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.25rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Debug Mode
        </a>
      </div>
    </div>
  );
};

// Try to render the fallback app
const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    createRoot(rootElement).render(
      <React.StrictMode>
        <FallbackApp />
      </React.StrictMode>
    );
    console.log('Fallback application rendered successfully');
  } catch (error) {
    console.error('Error rendering fallback application:', error);
    
    // If even the fallback React app fails, just show HTML
    rootElement.innerHTML = `
      <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1rem;font-family:system-ui,sans-serif;text-align:center">
        <h1 style="font-size:2rem;font-weight:bold;margin-bottom:1rem;color:#0f766e">
          Menu360
        </h1>
        <p style="font-size:1.25rem;max-width:600px;margin-bottom:1rem">
          We're experiencing technical difficulties.
        </p>
        <p style="max-width:600px;margin-bottom:2rem;color:#555">
          Try running npm install to resolve dependency issues, or check the console for errors.
        </p>
        <div>
          <button onclick="window.location.reload()" 
            style="background-color:#0f766e;color:white;border:none;padding:0.75rem 1.5rem;border-radius:0.25rem;font-weight:bold;cursor:pointer;margin-right:1rem">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
} else {
  console.error('Root element not found. Check if the HTML has a div with id="root"');
} 