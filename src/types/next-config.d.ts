declare module 'next' {
  interface NextConfig {
    reactCompiler?: boolean | { compilationMode?: 'annotation' };
    images?: {
      remotePatterns?: Array<{
        protocol?: string;
        hostname: string;
        port?: string;
        pathname?: string;
        search?: string;
      }>;
    };
    webpack?: (
      config: import('webpack').Configuration,
      options: any
    ) => import('webpack').Configuration;
    turbopack?: {
      resolveAlias?: Record<string, string>;
    };
  }
}
