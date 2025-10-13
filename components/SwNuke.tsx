'use client';
import { useEffect } from 'react';

export default function SwNuke({ version }: { version: string }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `sw-nuked@${version}`;
    // Run only once per version to avoid reload loops
    if (localStorage.getItem(key)) return;

    (async () => {
      try {
        // Unregister all SWs
        const regs = (await navigator.serviceWorker?.getRegistrations?.()) ?? [];
        await Promise.all(regs.map(r => r.unregister()));
        // Clear all caches owned by the SW
        const names = await caches.keys();
        await Promise.all(names.map(n => caches.delete(n)));
      } catch {/* ignore */}
      localStorage.setItem(key, '1');
      window.location.reload();
    })();
  }, [version]);

  return null;
}
