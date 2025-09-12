'use client';

import { useEffect } from 'react';

/** Adds a "product-page" class to <body> while this page is mounted. */
export default function ProductPageFlag() {
  useEffect(() => {
    document?.body.classList.add('product-page');
    return () => document?.body.classList.remove('product-page');
  }, []);
  return null;
}
