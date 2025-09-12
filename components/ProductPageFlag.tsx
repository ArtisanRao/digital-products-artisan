'use client';

import { useEffect } from 'react';

/**
 * While mounted, adds a "product-page" class to <body>
 * and sets data-page="product" so your scoped CSS applies.
 */
export default function ProductPageFlag() {
  useEffect(() => {
    const b = document.body;
    if (!b) return;

    b.classList.add('product-page');
    const prevDataPage = b.getAttribute('data-page');
    b.setAttribute('data-page', 'product');

    return () => {
      b.classList.remove('product-page');
      if (prevDataPage) b.setAttribute('data-page', prevDataPage);
      else b.removeAttribute('data-page');
    };
  }, []);

  return null;
}
