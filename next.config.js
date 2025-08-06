<<<<<<< HEAD
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  async redirects() {
    return [
      {
        source: '/help-center',
        destination: '/help',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/best-sellers',
        destination: '/bestsellers',
=======
﻿ /** @type {import('next').NextConfig} */

// Added redirects config for hyphenated URLs
// Harmless comment to force Git to detect a change

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // ✅ FIX: must be an object, not a boolean
  },
  images: {
    domains: ['localhost', 'digitalproductsartisan.com', 'images.unsplash.com'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      {
        source: '/contact',
        destination: '/contact-us',
        permanent: true,
      },
      {
        source: '/bestsellers',
        destination: '/best-sellers',
>>>>>>> 154bd8d (Fix config: use CommonJS syntax for PWA and redirects)
        permanent: true,
      },
    ];
  },
<<<<<<< HEAD
  reactStrictMode: true,
});

module.exports = nextConfig;
=======
};

export default nextConfig;
 
>>>>>>> 154bd8d (Fix config: use CommonJS syntax for PWA and redirects)
