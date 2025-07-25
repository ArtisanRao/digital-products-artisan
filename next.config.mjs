/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
export default {
  async rewrites() {
    return [
      {
        source: '/help',
        destination: '/help-center/index.html',
      },
      {
        source: '/best-sellers',
        destination: '/best-sellers/index.html',
      }
    ]
  },
}
