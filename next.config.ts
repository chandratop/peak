import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',

  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  trailingSlash: true,

  images: { unoptimized: true },

  // Turbopack alias (Next.js 16+ default bundler)
  turbopack: {
    resolveAlias: {
      'mapbox-gl': 'mapbox-gl/dist/mapbox-gl.js',
    },
  },
};

export default nextConfig;
