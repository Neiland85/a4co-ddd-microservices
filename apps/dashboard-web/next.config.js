/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compiler options for SWC (built-in in Next.js 15)
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',

    // Enable SWC React Transform
    reactRemoveProperties: process.env.NODE_ENV === 'production',

    // Styled-components support
    styledComponents: true,
  },

  // Experimental features for Next.js 15
  experimental: {
    // Enable SWC optimizations
    swcTraceProfiling: true,

    // Optimize imports for better tree shaking
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Turbopack configuration (Next.js 15 stable feature)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Transpile packages for monorepo
  transpilePackages: ['@/lib', '@/shared', '@/components', '@/hooks', '@/utils'],

  // TypeScript configuration
  typescript: {
    // Skip type checking during build (handled by separate process)
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Skip linting during build (handled by separate process)
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },

  // Output configuration
  output: 'standalone',

  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },

  // Webpack configuration for monorepo
  webpack: (config, { dev, isServer }) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Optimize chunks for better performance
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
