import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// 1. Auto-recovery from Vite chunk & dynamic module loading errors (new deployments)
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const lastReload = sessionStorage.getItem('bem_preload_reload');
  const now = Date.now();
  if (!lastReload || now - Number(lastReload) > 10000) {
    sessionStorage.setItem('bem_preload_reload', String(now));
    console.warn('Vite preload error detected. Auto-reloading to fetch newest build...');
    window.location.reload();
  }
});

window.addEventListener('error', (event) => {
  const msg = String(event?.message || '');
  if (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Loading chunk') ||
    msg.includes('Importing a module script failed')
  ) {
    const lastReload = sessionStorage.getItem('bem_preload_reload');
    const now = Date.now();
    if (!lastReload || now - Number(lastReload) > 10000) {
      sessionStorage.setItem('bem_preload_reload', String(now));
      console.warn('Chunk loading error caught. Auto-reloading with latest version...');
      window.location.reload();
    }
  }
});

// 2. Render root with ErrorBoundary
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

// 3. Service Worker Auto-Update & Cache Recovery
if ('serviceWorker' in navigator) {
  let refreshing = false;
  
  // When the active service worker updates, reload smoothly so user gets newest version
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      console.log('New Service Worker controller activated. Refreshing page for latest content...');
      window.location.reload();
    }
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        // Immediate check for updates on load
        reg.update();

        // If a new worker is already waiting, trigger it to activate immediately
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // When a new worker is detected during registration
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update available, skip waiting and activate immediately
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          }
        });
      })
      .catch((err) => console.error('Service Worker registration failed:', err));
  });

  // Re-check for new app updates whenever the user returns to the tab/window
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.update();
        }
      });
    }
  });
}
