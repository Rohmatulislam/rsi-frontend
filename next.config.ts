import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // For development, allow access from local network - will be overridden by command line
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rfbsyhpuuptvfeumxnra.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '**',
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
};

export default nextConfig;
