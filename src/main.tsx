import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import services for global access in development
import { membershipsService, addOnServicesService, serviceBookingsService } from './lib/firebaseServices'

// Expose services to global scope for debugging in development
if (import.meta.env.DEV) {
  (window as any).membershipsService = membershipsService;
  (window as any).addOnServicesService = addOnServicesService;
  (window as any).serviceBookingsService = serviceBookingsService;
}

// Register Service Worker for CORS handling in development
if ('serviceWorker' in navigator && import.meta.env.DEV) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => {
      // Service worker registered successfully
    })
    .catch(() => {
      // Service worker registration failed
    });
}

createRoot(document.getElementById("root")!).render(<App />);
