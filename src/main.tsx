import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/firebase';

console.log('🚀 Application starting...');
console.log('📦 Environment:', import.meta.env.MODE);

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ CRITICAL: Root element not found!');
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: monospace;">
      <h1 style="color: red;">❌ Critical Error</h1>
      <p>Root element not found. Check your index.html file.</p>
    </div>
  `;
} else {
  console.log('✅ Root element found');
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('✅ React app rendered successfully');
  } catch (error) {
    console.error('❌ Error rendering React app:', error);
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: monospace;">
        <h1 style="color: red;">❌ Render Error</h1>
        <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
        <pre>${error instanceof Error ? error.stack : ''}</pre>
      </div>
    `;
  }
}
