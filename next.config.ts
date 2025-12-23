import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Allow cross-origin requests from local network during development
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.10.159:3000',
    'http://192.168.1.0:3000',
    'http://10.0.0.0:3000',
  ],
  // For development, allow access from local network - will be overridden by command line
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "vpncigkytgwjlhqzvcbt.supabase.co",
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '**',
      },
      {
        // Backend server for uploaded doctor images (local network)
        protocol: 'http',
        hostname: '192.168.10.159',
        port: '2000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.0.0',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.0',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '192.168.10.0',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '192.168.10.159',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '10.0.0.0',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '172.16.0.0',
        port: '',
        pathname: '**',
      },
    ],
  },
  // Webpack config for HMR issues on cross-network access
  webpack: (config, { dev }) => {
    if (dev) {
      // Use polling for file watching (more reliable on network shares)
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  // Empty turbopack config to silence Next.js 16 warning
  // (Turbopack is default in Next.js 16, but we need webpack config for HMR polling)
  turbopack: {},
};

export default withNextIntl(nextConfig);
