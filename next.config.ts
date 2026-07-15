import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',

  basePath: '/peak',
  assetPrefix: '/peak/',

  images: { unoptimized: true },

  // Turbopack alias (Next.js 16+ default bundler)
  turbopack: {
    resolveAlias: {
      'mapbox-gl': 'mapbox-gl/dist/mapbox-gl.js',
    },
  },
};

export default nextConfig;
