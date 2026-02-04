import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      // https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cYFj4Kn3Lew36xTPUZmMN5kojiysXf9n1KHWh
      // configure this
      {
        protocol: 'https',
        hostname: '4aemqjor6g.ufs.sh',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  turbopack: {
    resolveAlias: {
      canvas: './src/lib/empty.ts',
    },
  },
};

export default nextConfig;
