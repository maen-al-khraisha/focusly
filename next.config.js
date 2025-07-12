/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/tasks',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
