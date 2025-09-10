import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-interactions'),
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-viewport',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  docs: {
    autodocs: 'tag',
  },

  core: {
    disableTelemetry: true,
  },

  viteFinal: async config => {
    // Habilitar hot reload optimizado
    config.server = {
      ...config.server,
      hmr: {
        overlay: true,
      },
      watch: {
        usePolling: true,
        interval: 100,
      },
    };

    // Optimizaciones para monorepo
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: ['@storybook/react', '@storybook/addon-actions', 'react', 'react-dom'],
    };

    // Alias para el Design System
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@a4co/design-system': join(__dirname, '../src'),
      },
    };

    return config;
  },

  // Configuración de webpack para assets estáticos
  staticDirs: ['../public'],

  // Features experimentales
  features: {
    buildStoriesJson: true,
  },
};

export default config;
