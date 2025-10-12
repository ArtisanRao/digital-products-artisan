'use client';

import React from 'react';

export default function ClientErrorCatcher() {
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    function onErr(e: ErrorEvent) {
      if (!msg) setMsg(e?.error?.message || e?.message || 'Client error');
    }
    function onRej(e: PromiseRejectionEvent) {
      const reason = (e?.reason && (e.reason.message || String(e.reason))) || 'Unhandled rejection';
      if (!msg) setMsg(reason);
    }
    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', onRej);
    return () => {
      window.removeEventListener('error', onErr);
      window.removeEventListener('unhandledrejection', onRej);
    };
  }, [msg]);

  if (!msg) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 12,
        bottom: 12,
        maxWidth: 520,
        background: '#fee2e2',
        border: '1px solid #fecaca',
        color: '#991b1b',
        padding: '10px 12px',
        borderRadius: 10,
        zIndex: 2147483647,
        boxShadow: '0 8px 20px rgba(0,0,0,.15)',
      }}
    >
      <strong>Client error:</strong> {String(msg)}
    </div>
  );
}
