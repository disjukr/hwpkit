const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  target: 'serverless',
  pageExtensions: ['page.tsx'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty',
      };
    }
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '../node_modules/canvaskit-wasm/bin/canvaskit.wasm',
            to: path.join(__dirname, './public/canvaskit.wasm'),
          },
        ],
      }),
    );
    return config;
  },
};
module.exports = config;
