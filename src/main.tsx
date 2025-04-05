
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element and log initialization
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
} else {
  console.log("Initializing React application...");
  createRoot(rootElement).render(<App />);
}
