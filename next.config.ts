import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/lingualexis' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/lingualexis' : '',
};

export default nextConfig;
