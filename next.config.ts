import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  output: "export",
  distDir: ".next",
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  devIndicators: false,
  // Performance optimizations for low-power devices
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // Optimize for smaller bundle size
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // Reduce JavaScript bundle size
  productionBrowserSourceMaps: false,
};

// Configure PWA settings
const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
});

export default pwaConfig(nextConfig as any);
