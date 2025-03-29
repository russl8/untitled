// import type { NextConfig } from "next";

// module.exports = {
 
// };

const path = require("path");

module.exports = {
  images: {
    domains: ['untitled-bookmarks.s3.us-east-2.amazonaws.com'],
  },
  webpack(config: any) {
    config.resolve.alias["@"] = path.join(__dirname); 
    return config;
  },
};

