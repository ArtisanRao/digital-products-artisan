'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const Snipcart = dynamic(
  () => import('snipcart'), // if you have a Snipcart React wrapper; else skip
  { ssr: false }
);

export default function SnipcartLoaderClient() {
  useEffect(() => {
    // Configure Snipcart settings
    window.SnipcartSettings = {
      locale: 'en-US',
      currency: 'USD',
    };
  }, []);

  return (
    <>
      <script
        async
        src="https://cdn.snipcart.com/themes/v3.4.1/default/snipcart.js"
      ></script>
      <div
        hidden
        id="snipcart"
        data-api-key="ZDgyODMyODgtMzdhZC00ZTI0LTkzZTUtYjRhMTM0MDg4ODM2NjM4ODg4NTc5NTI0NTk5MjQ4"
        data-config-modal-style="side"
      ></div>
    </>
  );
}
