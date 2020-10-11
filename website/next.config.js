const config = {
  target: 'serverless',
  pageExtensions: ['page.tsx'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty',
      };
    }
    return config;
  },
};
module.exports = config;
