import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Register PWA service worker with automatic update activation
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true);
  },
  onRegisteredSW(_swUrl, r) {
    if (r) {
      // Periodically check for updates every 10 minutes
      setInterval(async () => {
        if (!(!r.installing && navigator)) return;
        if ('onLine' in navigator && !navigator.onLine) return;
        await r.update();
      }, 10 * 60 * 1000);
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
