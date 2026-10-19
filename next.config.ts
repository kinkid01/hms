import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
  images: {
    unoptimized: true,
  },
  // Old Horizon template URLs → patient portal.
  async redirects() {
    return [
      { source: '/admin/:path*', destination: '/portal/dashboard', permanent: false },
      { source: '/rtl/:path*', destination: '/portal/dashboard', permanent: false },
    ];
  },
};

export default nextConfig;
