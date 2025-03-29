const path = require('path');

module.exports = {
  images: {
    domains: ['untitled-bookmarks.s3.us-east-2.amazonaws.com'],
  },
  webpack: (config:any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'), // This points to the root directory of your project
    };
    return config;
  },
};
