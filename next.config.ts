import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  distDir: "dist",
  reactStrictMode: process.env.NODE_ENV === "production",
  output: "standalone",
    images: {
    domains: ["example.com", "another-domain.com"],
    minimumCacheTTL: 3600,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64], // Added for better image optimization
  },
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    // optimizeCss: true,
        largePageDataBytes: 256 * 1000,
    // turbo: {
    //   resolveExtensions: [".mdx", ".ts", ".tsx", ".jsx", ".json"],
    // },
  },
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 5,
    pagesBufferLength: 3,
  },
  webpack: (
    config: Configuration,
    context: {
      isServer: boolean;
      dev: boolean;
      defaultLoaders?: object;
    }
  ) => {
    const { isServer } = context;

    // Disable cache for client-side builds
    if (!isServer) {
      config.cache = {
        type: "memory",
        maxGenerations: 1,
      };
    }

    // Limit memory usage during builds
    config.performance = {
      ...config.performance,
      maxAssetSize: 512 * 1024, // 512KB
      maxEntrypointSize: 512 * 1024,
      hints: "warning",
    };

    // Optimize chunk splitting
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          maxSize: 200 * 1024, // 200KB per chunk
          minSize: 20 * 1024, // 20KB min chunk size
        },
      };
    }

    return config;
  },
};

export default nextConfig;