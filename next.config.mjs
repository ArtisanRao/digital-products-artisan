/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/best-sellers',
        destination: '/best-sellers/index.html',
      }
    ]
  }
}

export default nextConfig
