import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["untitled-bookmarks.s3.us-east-2.amazonaws.com"],
  },
};

const path = require("path");

module.exports = {
  webpack(config: any) {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
};

export default nextConfig;
