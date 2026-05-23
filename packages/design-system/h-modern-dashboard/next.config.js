const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@a4co/shared-utils'],

  // Prevent Next.js from inferring /Users/estudio as workspace root
  // when unrelated lockfiles exist outside this repository.
  outputFileTracingRoot: path.join(__dirname, '../../..'),
};

module.exports = nextConfig;
