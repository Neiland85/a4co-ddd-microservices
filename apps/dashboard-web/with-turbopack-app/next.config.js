/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack-compatible configuration
  
  // Turbopack configuration (replaces experimental.turbo)
  turbopack: {
    // Set root directory to silence warnings
    root: process.cwd(),
  },
  
  // Experimental features (Turbopack compatible)
  experimental: {
    // Optimize imports for better tree shaking
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // TypeScript configuration
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Skip linting during build in development (use separate process)
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
    dirs: ['app'],
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Performance optimizations
  poweredByHeader: false,
  
  // Enable standalone output for better deployment
  output: 'standalone',
};

module.exports = nextConfig;
