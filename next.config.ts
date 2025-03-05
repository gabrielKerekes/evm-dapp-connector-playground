import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  ...(isProduction && {
    output: "export",
    // Ensure the base path matches your GitHub repository name
    // For example, if your repo is username.github.io/repo-name, use '/repo-name'
    basePath: "/evm-dapp-connector-playground",
    // This is needed for GitHub Pages
    images: {
      unoptimized: true,
    },
  }),
};

export default nextConfig;
