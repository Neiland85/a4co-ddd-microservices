import React from 'react';
import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'a4co-cream',
          value: '#fdf8f0',
        },
        {
          name: 'a4co-olive',
          value: '#f7f8f3',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
        wide: {
          name: 'Wide',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
    docs: {
      theme: {
        base: 'light',
        brandTitle: 'A4CO Design System',
        brandUrl: 'https://a4co.com',
        brandImage: '/logo.svg',
        brandTarget: '_self',
        
        // Typography
        fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        fontCode: '"JetBrains Mono", "Monaco", "Consolas", monospace',
        
        // Colors
        colorPrimary: '#7a8a4f',
        colorSecondary: '#a67c5e',
        
        // UI
        appBg: '#fdf8f0',
        appContentBg: '#ffffff',
        appBorderColor: '#e8ddd0',
        appBorderRadius: 8,
        
        // Text colors
        textColor: '#434a30',
        textInverseColor: '#ffffff',
        
        // Toolbar default and active colors
        barTextColor: '#606b40',
        barSelectedColor: '#7a8a4f',
        barBg: '#faf8f5',
        
        // Form colors
        inputBg: '#ffffff',
        inputBorder: '#d9c5b0',
        inputTextColor: '#434a30',
        inputBorderRadius: 4,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      return (
        <div className={theme === 'dark' ? 'dark' : ''}>
          <div className="min-h-screen bg-background text-foreground">
            <Story />
          </div>
        </div>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;