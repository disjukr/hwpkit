const config = {
  typescript: { ignoreBuildErrors: true },
  // NOTE: `target: 'serverless'` is deprecated/removed in modern Next.js.
  pageExtensions: ['page.tsx'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Modern Next.js no longer polyfills Node core modules on the client.
      // Keep legacy behavior for this project.
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
      };
    }
    return config;
  },
};
module.exports = config;
