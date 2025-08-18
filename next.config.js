const withPWA = require('next-pwa')({
  dest: 'public',       // Output folder for service worker and precache files
  register: true,       // Auto-register the service worker
  skipWaiting: true,    // Activate new service worker immediately
  disable: process.env.NODE_ENV === 'development', // Disable PWA in dev
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  
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
        permanent: true,
      },
    ];
  },
});

module.exports = nextConfig;
