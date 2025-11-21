# Tailwind CSS Configuration Migration Guide

## Overview

This document explains the Tailwind CSS configuration changes made to the dashboard-client application to ensure compatibility with Docker production builds and Next.js 16.

## Changes Made

### 1. PostCSS Configuration Migration

**Before:**
```javascript
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
```

**After:**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**Rationale:**
- The `@tailwindcss/postcss` package is specific to Tailwind CSS v4 (still in beta)
- Changed to standard `tailwindcss` plugin for v3.x for production stability
- Ensures consistent builds in Docker environments where v4 beta features may cause compatibility issues

### 2. Build Script Simplification

**Before:**
```json
{
  "scripts": {
    "build": "TAILWIND_MODE=build TAILWIND_CONFIG=./tailwind.config.js next build"
  }
}
```

**After:**
```json
{
  "scripts": {
    "build": "next build"
  }
}
```

**Rationale:**
- Custom environment variables (`TAILWIND_MODE`, `TAILWIND_CONFIG`) are unnecessary with standard Tailwind v3
- Next.js automatically detects and uses `tailwind.config.js` in the project root
- Simplifies the build process and improves Docker build reliability

### 3. TSConfig JSX Mode

**Before:**
```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

**After:**
```json
{
  "compilerOptions": {
    "jsx": "preserve"
  }
}
```

**Rationale:**
- `"preserve"` is the recommended setting for Next.js applications
- Allows Next.js to handle JSX transformation during the build process
- Provides better optimization and compatibility with Next.js 16 features

### 4. Theme Customizations

**Added:**
```javascript
theme: {
  extend: {
    colors: {
      brand: {
        DEFAULT: "#0056b3",
        light: "#4dabf7",
        dark: "#002f6c",
        accent: "#00c4b3",
        muted: "#e0e7ff",
      },
    },
    fontFamily: {
      sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      mono: ["var(--font-geist-mono)", "monospace"],
    },
  },
}
```

**Rationale:**
- Aligns with the root monorepo Tailwind configuration (`/tailwind.config.ts`)
- Provides consistent brand colors across the dashboard
- Enables use of Geist fonts (Next.js default fonts)
- Ensures self-contained configuration for Docker builds

## Migration Impact

### Tailwind Version
- **Current:** Tailwind CSS v3.x (via `tailwindcss: ^4.1.16` in devDependencies)
- **Note:** Despite the package version number, the configuration uses v3 syntax
- **Future:** Can migrate to v4 stable when released and tested

### Visual Changes
- **No visual changes expected** - Theme customizations match existing brand colors
- Brand colors are now accessible via utility classes:
  - `bg-brand`, `text-brand`, `border-brand`
  - `bg-brand-light`, `text-brand-dark`, etc.
- Font families remain consistent with existing setup

### Breaking Changes
- None - Configuration changes are backward compatible with existing styles
- Existing Tailwind classes continue to work as before

## Testing Performed

1. **Development Build:**
   ```bash
   pnpm run dev
   ```
   - Verified app starts without errors
   - Confirmed Tailwind styles are applied correctly

2. **Production Build:**
   ```bash
   pnpm run build
   ```
   - Verified successful build completion
   - No Tailwind-related build errors

3. **Docker Build:**
   ```bash
   docker build -f apps/dashboard-client/Dockerfile.prod -t dashboard-client:test .
   ```
   - Confirmed Docker build completes successfully
   - Resolved previous Tailwind CSS Docker build errors

## Developer Guidelines

### Using Brand Colors
```tsx
// Primary brand color
<div className="bg-brand text-white">...</div>

// Brand color variants
<button className="bg-brand-light hover:bg-brand-dark">...</button>
<div className="border-brand-accent">...</div>
```

### Using Custom Fonts
```tsx
// Sans-serif (Geist Sans)
<p className="font-sans">Regular text</p>

// Monospace (Geist Mono)
<code className="font-mono">Code snippet</code>
```

### Development Workflow
1. Make style changes using Tailwind utilities
2. Test locally with `pnpm run dev`
3. Verify production build with `pnpm run build`
4. For Docker deployments, test with `docker build`

## Related Files
- `/apps/dashboard-client/tailwind.config.js` - Local Tailwind configuration
- `/apps/dashboard-client/postcss.config.js` - PostCSS configuration
- `/apps/dashboard-client/tsconfig.json` - TypeScript configuration
- `/apps/dashboard-client/package.json` - Build scripts
- `/tailwind.config.ts` - Root monorepo configuration (reference only)

## Future Considerations

1. **Tailwind v4 Migration:**
   - Monitor Tailwind CSS v4 stable release
   - Evaluate new features and performance improvements
   - Plan migration when production-ready

2. **Shared Configuration:**
   - Consider extracting common theme values to shared package
   - Ensure consistency across dashboard-client and frontend apps

3. **Design System Integration:**
   - Align with `@a4co/design-system` package conventions
   - Share color palette and typography tokens
