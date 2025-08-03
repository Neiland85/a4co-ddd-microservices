export const colors = {
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
  semantic: {
    primary: 'var(--a4co-primary)',
    secondary: 'var(--a4co-secondary)',
    accent: 'var(--a4co-accent)',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  }
}

export const typography = {
  fonts: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    serif: 'Merriweather, Georgia, serif',
    mono: 'Fira Code, Menlo, monospace',
  },
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  weights: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  }
}

export const spacing = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  88: '22rem',
  96: '24rem',
  128: '32rem',
}

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
}

export const shadows = {
  none: 'none',
  soft: '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
}

export const radii = {
  none: '0px',
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
}

export const transitions = {
  durations: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easings: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
}