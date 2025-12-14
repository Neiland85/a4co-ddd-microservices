/**  A4CO DESIGN SYSTEM — Tailwind Preset (Avanzado)
 *   Ruta: packages/design-system/tailwind.preset.js
 */

const plugin = require('tailwindcss/plugin');

module.exports = {
  theme: {
    extend: {
      /* ---------------------------
         TOKENS DE COLOR OKLCH
      --------------------------- */
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        /* Additional semantic color tokens - ensure consuming apps define these CSS variables */
        warning: 'var(--warning)',
        'warning-foreground': 'var(--warning-foreground)',
        success: 'var(--success)',
        'success-foreground': 'var(--success-foreground)',
        danger: 'var(--danger)',
        'danger-foreground': 'var(--danger-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        /* Fix for ring-border compatibility (used in some components) */
        'ring-border': 'var(--border)',

        /* Charts */
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
        },

        /* Sidebar */
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },

      /* ---------------------------
         RADIO & SPACING
      --------------------------- */
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 2px)',
        lg: 'calc(var(--radius) + 2px)',
        xl: 'calc(var(--radius) + 6px)',
      },

      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },

      /* ---------------------------
         TIPOGRAFÍA
      --------------------------- */
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },

      /* ---------------------------
         ANIMACIONES BASE
      --------------------------- */
      animation: {
        'fade-in': 'fadeIn 0.4s ease',
        'fade-out': 'fadeOut 0.4s ease',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'spin-slow': 'spin 2s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-10px)', opacity: '0' },
        },
        spinner: {
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },

  /* ---------------------------
     PLUGINS PERSONALIZADOS
  --------------------------- */
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities }) {
      /* VARIABLES BASE (ROOT YA EN globals.css) */
      addBase({
        '*': {
          'border-color': 'var(--border)',
        },
        ':root': {
          /* Component Variables */
          '--btn-padding-y': '0.5rem',
          '--btn-padding-x': '1rem',
          '--btn-radius': 'var(--radius)',
          '--btn-hover-opacity': '0.9',
          '--btn-active-scale': '0.97',

          '--card-padding': '1.5rem',
          '--card-radius': 'calc(var(--radius) + 6px)' /* Corresponds to rounded-xl */,
          '--card-shadow':
            '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' /* Corresponds to shadow-sm */,

          '--input-padding-y': '0.5rem',
          '--input-padding-x': '1rem',
          '--input-radius': 'calc(var(--radius) - 2px)' /* Corresponds to rounded-md */,
          '--input-ring-width': '2px',

          /* Input Sizes */
          '--input-h': '2.5rem' /* h-10 */,
          '--input-sm-h': '2.25rem' /* h-9 */,
          '--input-lg-h': '3rem' /* h-12 */,

          /* Button Sizes */
          '--btn-h': '2.5rem' /* h-10 */,
          '--btn-sm-h': '2.25rem' /* h-9 */,
          '--btn-lg-h': '3rem' /* h-12 */,
        },
      });

      /* COMPONENTES REUSABLES */
      addComponents({
        '.btn-a4co': {
          /* Base styles for all buttons */
          '@apply inline-flex items-center justify-center font-medium transition-all duration-150':
            {},
          height: 'var(--btn-h)',
          'padding-block': 'var(--btn-padding-y)',
          'padding-inline': 'var(--btn-padding-x)',
          'border-radius': 'var(--btn-radius)',
          '&:hover': {
            opacity: 'var(--btn-hover-opacity)',
          },
          '&:active': {
            transform: 'scale(var(--btn-active-scale))',
          },
          '&:disabled': {
            '@apply pointer-events-none': {},
            opacity: '0.65',
          },
          /* Default to primary variant */
          '@apply bg-primary text-primary-foreground': {},
        },

        /* Color Variants */
        '.btn-secondary': {
          '@apply bg-secondary text-secondary-foreground': {},
        },
        '.btn-destructive': {
          '@apply bg-destructive text-destructive-foreground': {},
        },
        '.btn-warning': {
          '@apply bg-warning text-warning-foreground': {},
        },

        /* Size Variants */
        '.btn-sm': {
          '@apply text-sm': {},
          height: 'var(--btn-sm-h)',
          '--btn-padding-x': '0.75rem' /* px-3 */,
        },
        '.btn-lg': {
          '@apply text-lg': {},
          height: 'var(--btn-lg-h)',
          '--btn-padding-x': '2rem' /* px-8 */,
        },
        '.btn-icon': {
          width: 'var(--btn-h)',
          '--btn-padding-x': '0',
        },

        /* Style Variants */
        '.btn-outline': {
          '@apply border bg-transparent': {},
          '--btn-bg-color': 'var(--background)',
          '--btn-text-color': 'var(--foreground)',
          'background-color': 'var(--btn-bg-color)',
          color: 'var(--btn-text-color)',
          '&:hover': {
            '@apply bg-accent text-accent-foreground': {},
            opacity: '1' /* Override base hover opacity for a fill effect */,
          },
        },
        '.btn-ghost': {
          '@apply bg-transparent': {},
          '&:hover': {
            '@apply bg-accent text-accent-foreground': {},
            opacity: '1',
          },
        },

        '.card-a4co': {
          '@apply border': {},
          'background-color': 'var(--card)',
          color: 'var(--card-foreground)',
          padding: 'var(--card-padding)',
          'border-radius': 'var(--card-radius)',
          'box-shadow': 'var(--card-shadow)',
        },

        '.input-a4co': {
          '@apply w-full border bg-background focus:outline-none': {},
          height: 'var(--input-h)',
          'padding-block': 'var(--input-padding-y)',
          'padding-inline': 'var(--input-padding-x)',
          'border-radius': 'var(--input-radius)',
          '&:focus': {
            'box-shadow': '0 0 0 var(--input-ring-width) var(--ring)',
          },
        },
        '.input-sm': {
          '@apply text-sm': {},
          height: 'var(--input-sm-h)',
        },
        '.input-lg': {
          '@apply text-base': {},
          height: 'var(--input-lg-h)',
          /* Increase horizontal padding for larger inputs */
          '--input-padding-x': '1.25rem',
        },

        /* CHECKBOX COMPONENT */
        '.checkbox-a4co': {
          '@apply h-4 w-4 shrink-0 rounded-sm border border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50':
            {},
          '&[data-state="checked"]': {
            '@apply bg-primary text-primary-foreground': {},
          },
        },

        /* TOOLTIP COMPONENT */
        '.tooltip-a4co': {
          '@apply z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md':
            {},
          '&[data-state="open"]': {
            '@apply animate-fade-in animate-slide-in': {},
          },
          '&[data-state="closed"]': {
            '@apply animate-fade-out animate-slide-out': {},
          },
        },
      });

      /* UTILIDADES EXTRAS */
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.center-flex': {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
        '.animate-delay-100': { 'animation-delay': '100ms' },
        '.animate-delay-200': { 'animation-delay': '200ms' },
        '.animate-delay-300': { 'animation-delay': '300ms' },
      });
    }),
  ],
};
