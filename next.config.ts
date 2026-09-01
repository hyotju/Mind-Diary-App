import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  experimental: {
    optimizePackageImports: ["motion"],
  },
};

export default nextConfig;
