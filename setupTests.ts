import '@testing-library/jest-dom'
import { vi } from 'vitest';
// setupTests.js or equivalent setup file
if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = vi.fn();
} else {
  globalThis.fetch = vi.fn();
}


