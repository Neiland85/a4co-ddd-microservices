/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@a4co/shared-utils'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
