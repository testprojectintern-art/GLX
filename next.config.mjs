/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      // Proxy backend ERP API requests to Express server seamlessly on the same host
      {
        source: '/api/v1/:path*',
        destination: process.env.BACKEND_API_URL || 'http://localhost:5000/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
