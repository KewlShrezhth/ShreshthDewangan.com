import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  agentRules: false,
  images: {
    remotePatterns: [new URL("https://z5bhpsarz1xapsvu.public.blob.vercel-storage.com/uploads/**")],
    minimumCacheTTL: 2678400, // 31 days; upload keys are unique (timestamp+random), so they never change
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
