const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // ✅ Must be object, not boolean
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
      // Redirects from HEAD
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

      // Redirects from other branch
      {
        source: '/contact',
        destination: '/contact-us',
        permanent: true,
      },
      {
        source: '/bestsellers',
        destination: '/best-sellers',
        permanent: true,
      },
    ];
  },
});

module.exports = nextConfig;
  