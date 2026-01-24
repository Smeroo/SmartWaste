"use client";
import { useEffect } from 'react';

// RegisterSW registra il service worker per supporto PWA/offline
export default function RegisterSW() {
  useEffect(() => {
    // Registra il service worker se supportato dal browser
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Service Worker registration successful', reg))
        .catch((err) => console.error('Service Worker registration failed', err));
    }
  }, []);

  // Questo componente non renderizza nulla
  return null;
}
