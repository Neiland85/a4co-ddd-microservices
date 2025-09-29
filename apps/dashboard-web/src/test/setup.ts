// apps/dashboard-web/src/test/setup.ts
import '@testing-library/jest-dom';

// Extender expect con matchers de jest-dom
declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T> {}
}
