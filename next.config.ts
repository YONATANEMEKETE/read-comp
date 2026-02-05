import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import withPWA from '@ducanh2912/next-pwa';

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
  webpack: (config: Configuration) => {
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    (config.resolve.alias as Record<string, any>).canvas = false;
    return config;
  },
};

const withPWAConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    navigateFallback: '/offline',
    runtimeCaching: [
      {
        urlPattern: /^https?:.*\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 128,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
      {
        urlPattern: /^https?:.*\.(?:pdf)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'pdfs',
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
      {
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages',
          networkTimeoutSeconds: 5,
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 60 * 60 * 24 * 7,
          },
        },
      },
    ],
    additionalManifestEntries: [
      { url: '/offline', revision: '1' },
      { url: '/', revision: '1' },
    ],
  },
});

export default withPWAConfig(nextConfig);
