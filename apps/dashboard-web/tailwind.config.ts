import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        a4co: {
          olive: {
            50: '#f7f8f3',
            100: '#eef0e6',
            200: '#dde2cd',
            300: '#c6cfa8',
            400: '#adb985',
            500: '#94a366',
            600: '#7a8a4f',
            700: '#606b40',
            800: '#4f5736',
            900: '#434a30',
            950: '#2a2f1c',
          },
          clay: {
            50: '#fefdfb',
            100: '#fdfbf7',
            200: '#fbf6ef',
            300: '#f7eddc',
            400: '#f1dcc2',
            500: '#e9c7a1',
            600: '#d9a97c',
            700: '#c0865b',
            800: '#a16c4b',
            900: '#866041',
            950: '#4c3526',
          },
          cream: {
            50: '#fefdfb',
            100: '#fefbf9',
            200: '#fdf7f2',
            300: '#fceee4',
            400: '#f8dcc8',
            500: '#f2c4a5',
            600: '#e6a47f',
            700: '#d17f5c',
            800: '#b3654c',
            900: '#965441',
            950: '#532e26',
          },
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
