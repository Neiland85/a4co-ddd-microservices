const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@a4co/shared-utils'],

  // Prevent Next.js from inferring /Users/estudio as workspace root
  // when unrelated lockfiles exist outside this repository.
  outputFileTracingRoot: path.join(__dirname, '../../..'),

  // h-modern-dashboard is currently frozen in FASE 3.
  // The parent design-system still uses a legacy .eslintrc.js that extends
  // the root flat ESLint config, which Next cannot consume during build.
  // Keep build reproducible and handle ESLint migration in a dedicated PR.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
