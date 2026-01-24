import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'html'],
    },
    include: [
      'apps/**/__tests__/**/*.spec.ts',
      'apps/**/__tests__/**/*.test.ts',
      'packages/**/__tests__/**/*.spec.ts',
      'packages/**/__tests__/**/*.test.ts',
    ],
  },
});
