import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // Ensure the base path matches your GitHub repository name
  // For example, if your repo is username.github.io/repo-name, use '/repo-name'
  basePath: "/evm-dapp-connector-playground",
  // This is needed for GitHub Pages
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
