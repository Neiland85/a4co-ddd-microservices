/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
  // Disable prerendering for error pages
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Disable static generation for all pages
  generateBuildId: async () => 'build-' + Date.now(),
};

module.exports = nextConfig;
