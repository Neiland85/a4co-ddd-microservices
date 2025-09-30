import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingRoot: '/Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices',
  images: {
    domains: ['example.com'],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
