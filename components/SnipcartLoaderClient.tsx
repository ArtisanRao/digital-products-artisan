'use client';

import dynamic from 'next/dynamic';

const SnipcartLoader = dynamic(() => import('@/components/SnipcartLoader'), {
  ssr: false,
});

export default function SnipcartLoaderClient() {
  return <SnipcartLoader />;
}
