/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["@a4co/shared-utils"],
}

module.exports = nextConfig
