declare module 'next' {
  export type Metadata = Record<string, unknown>;

  export namespace MetadataRoute {
    export type Robots = Record<string, unknown>;
    export type Sitemap = Array<Record<string, unknown>>;
    export type Manifest = Record<string, unknown>;
  }

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
