import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  webpack(config) {
    // Paths with an apostrophe can break bare "three" resolution; pin to absolute file.
    config.resolve.alias = {
      ...config.resolve.alias,
      three$: path.join(__dirname, "node_modules", "three", "build", "three.module.js"),
    };
    return config;
  },
};

export default nextConfig;
