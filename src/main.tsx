import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ui/error-boundary';

// Create fallback UI that doesn't depend on complex components
const SimpleFallbackUI = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    fontFamily: 'system-ui, sans-serif',
    textAlign: 'center'
  }}>
    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
      Menu360 encountered an error
    </h1>
    <p style={{ maxWidth: '600px', marginBottom: '2rem' }}>
      We're sorry, but something went wrong while loading the application. 
      This could be due to a network error or a problem with your configuration.
    </p>
    <div>
      <button 
        onClick={() => window.location.reload()}
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
        Refresh Page
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

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={<SimpleFallbackUI />}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ErrorBoundary>
);
