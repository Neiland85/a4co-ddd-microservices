import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  // Note: `output: 'export'` requires generateStaticParams for dynamic routes.
  // Use standalone output for builds in the monorepo.
  output: 'standalone',
  trailingSlash: true,
  eslint: {
    // Temporary: unblock `next build` while we normalize flat ESLint config in the monorepo.
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
