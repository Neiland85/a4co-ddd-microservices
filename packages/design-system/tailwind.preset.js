const plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    extend: {
      colors: {
        // Tokens de color de marca A4CO
        a4co: {
          olive: {
            50: "#f7f8f3",
            100: "#eef0e6",
            200: "#dde2cd",
            300: "#c6cfa8",
            400: "#adb985",
            500: "#94a366",
            600: "#7a8a4f",
            700: "#606b40",
            800: "#4f5736",
            900: "#434a30",
            950: "#2a2f1c",
          },
          clay: {
            50: "#faf8f5",
            100: "#f4f0e8",
            200: "#e8ddd0",
            300: "#d9c5b0",
            400: "#c8a88d",
            500: "#b8906f",
            600: "#a67c5e",
            700: "#8a6650",
            800: "#705446",
            900: "#5c463a",
            950: "#3a2b24",
          },
          cream: {
            50: "#fefcf8",
            100: "#fdf8f0",
            200: "#faf0de",
            300: "#f6e4c4",
            400: "#f0d49f",
            500: "#e9c178",
            600: "#dfa94d",
            700: "#c8903a",
            800: "#a37332",
            900: "#855e2d",
            950: "#543a1a",
          },
        },
        // Colores semánticos
        primary: 'var(--a4co-primary)',
        secondary: 'var(--a4co-secondary)',
        accent: 'var(--a4co-accent)',
        success: 'var(--a4co-success)',
        warning: 'var(--a4co-warning)',
        danger: 'var(--a4co-danger)',
        info: 'var(--a4co-info)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Menlo', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
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
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [
    // Plugin personalizado para componentes A4CO
    plugin(function({ addBase, addComponents, addUtilities, theme }) {
      // CSS Variables base
      addBase({
        ':root': {
          '--a4co-primary': theme('colors.a4co.olive.600'),
          '--a4co-secondary': theme('colors.a4co.clay.600'),
          '--a4co-accent': theme('colors.a4co.cream.500'),
          '--a4co-success': '#10b981',
          '--a4co-warning': '#f59e0b',
          '--a4co-danger': '#ef4444',
          '--a4co-info': '#3b82f6',
          '--font-sans': 'Inter',
          '--font-serif': 'Merriweather',
          '--font-mono': 'Fira Code',
        },
      })
      
      // Componentes base
      addComponents({
        '.btn-a4co': {
          '@apply px-4 py-2 rounded-lg font-medium transition-all duration-200': {},
          '@apply hover:shadow-md active:scale-95': {},
        },
        '.card-a4co': {
          '@apply bg-white rounded-xl shadow-base p-6': {},
          '@apply border border-gray-100': {},
        },
        '.input-a4co': {
          '@apply w-full px-4 py-2 rounded-lg border border-gray-300': {},
          '@apply focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent': {},
        },
      })
      
      // Utilidades personalizadas
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.animate-delay-100': {
          'animation-delay': '100ms',
        },
        '.animate-delay-200': {
          'animation-delay': '200ms',
        },
        '.animate-delay-300': {
          'animation-delay': '300ms',
        },
      })
    }),
  ],
}