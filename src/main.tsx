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

// Find the root element and render the app
const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    createRoot(rootElement).render(
      <HelmetProvider>
        <ErrorBoundary fallback={<SimpleFallbackUI />}>
          <App />
        </ErrorBoundary>
      </HelmetProvider>
    );
    console.log('Application rendered successfully');
  } catch (error) {
    console.error('Error rendering the application:', error);
    
    // Fallback to basic HTML rendering if React fails completely
    rootElement.innerHTML = `
      <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1rem;font-family:system-ui,sans-serif;text-align:center">
        <h1 style="font-size:1.5rem;font-weight:bold;margin-bottom:1rem">
          Critical rendering error
        </h1>
        <p style="max-width:600px;margin-bottom:2rem">
          The application failed to initialize properly. This could be due to a JavaScript error.
          Please check the console for more details.
        </p>
        <div>
          <button onclick="window.location.reload()" 
            style="background-color:#0f766e;color:white;border:none;padding:0.75rem 1.5rem;border-radius:0.25rem;font-weight:bold;cursor:pointer;margin-right:1rem">
            Refresh Page
          </button>
          <a href="/debug.html"
            style="background-color:#e5e7eb;color:#1f2937;border:none;padding:0.75rem 1.5rem;border-radius:0.25rem;font-weight:bold;text-decoration:none;display:inline-block">
            Debug Mode
          </a>
        </div>
      </div>
    `;
  }
} else {
  console.error('Root element not found. Check if the HTML has a div with id="root"');
}
