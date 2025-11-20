/** @type {import("next").NextConfig} */
const nextConfig = {
  outputFileTracingRoot: '../../',
  // Disable static generation to prevent SSR issues
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
