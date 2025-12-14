# @a4co/design-system

A4CO Design System - Tailwind preset and shared UI components for A4CO microservices.

## Installation

This package is already installed as part of the A4CO monorepo. To use it in your application:

```bash
pnpm add @a4co/design-system
```

## Usage

### Tailwind Configuration

In your `tailwind.config.js`:

```javascript
const preset = require('@a4co/design-system/tailwind.preset');

module.exports = {
  presets: [preset],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    // Include design-system components
    '../../packages/design-system/src/**/*.{js,jsx,ts,tsx}',
  ],
};
```

### Required CSS Variables

**Important**: All consuming applications MUST define the following CSS variables in their global CSS file for the design system to work correctly.

Add these to your `globals.css` or main CSS file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --secondary: oklch(0.968 0.007 247.896);
  --secondary-foreground: oklch(0.208 0.042 265.755);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --accent-foreground: oklch(0.208 0.042 265.755);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.984 0.003 247.858);
  
  /* Semantic color tokens */
  --warning: oklch(0.795 0.184 86.047);
  --warning-foreground: oklch(0.208 0.042 265.755);
  --success: oklch(0.648 0.15 142.495);
  --success-foreground: oklch(0.984 0.003 247.858);
  --danger: oklch(0.577 0.245 27.325);
  --danger-foreground: oklch(0.984 0.003 247.858);
  
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
}

.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.208 0.042 265.755);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.984 0.003 247.858);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.984 0.003 247.858);
  
  /* Semantic color tokens - dark mode */
  --warning: oklch(0.852 0.199 91.936);
  --warning-foreground: oklch(0.208 0.042 265.755);
  --success: oklch(0.723 0.191 142.495);
  --success-foreground: oklch(0.984 0.003 247.858);
  --danger: oklch(0.704 0.191 22.216);
  --danger-foreground: oklch(0.984 0.003 247.858);
  
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
}
```

### Color Tokens

The design system provides the following semantic color tokens:

- **Base colors**: `background`, `foreground`, `card`, `popover`
- **Interactive colors**: `primary`, `secondary`, `muted`, `accent`
- **Destructive actions**: `destructive`
- **Semantic states**: `warning`, `success`, `danger`
- **Form elements**: `border`, `input`, `ring`

Each color has a corresponding `-foreground` variant for text that should be readable on that background.

### Components

Components are built with React and styled using Tailwind CSS. Import them as needed:

```typescript
import { Button } from '@a4co/design-system';
```

## Development

Build the package:

```bash
pnpm run build
```

Run tests:

```bash
pnpm run test
```

Run Storybook:

```bash
pnpm run storybook
```

## License

Private - A4CO Project
