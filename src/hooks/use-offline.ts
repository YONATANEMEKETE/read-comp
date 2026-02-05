import { useEffect, useRef, useState } from 'react';

const PING_URL = '/manifest.webmanifest';

export const useOffline = () => {
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof navigator === 'undefined') return false;
    return !navigator.onLine;
  });
  const pingInFlight = useRef(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    const verifyOnline = async () => {
      if (pingInFlight.current) return;
      pingInFlight.current = true;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        await fetch(PING_URL, {
          cache: 'no-store',
          signal: controller.signal,
        });
        clearTimeout(timeout);
        setIsOffline(false);
      } catch {
        // Keep offline
      } finally {
        pingInFlight.current = false;
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('focus', verifyOnline);

    if (navigator.onLine) {
      verifyOnline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('focus', verifyOnline);
    };
  }, []);

  return isOffline;
};
