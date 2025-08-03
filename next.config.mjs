/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
