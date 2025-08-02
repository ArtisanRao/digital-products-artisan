 /** @type {import('next').NextConfig} */

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
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
