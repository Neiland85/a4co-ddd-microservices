/** @type {import("next").NextConfig} */
const nextConfig = {
  outputFileTracingRoot: '../../',
  output: 'standalone', // Optimización para Docker
};

export default nextConfig;

