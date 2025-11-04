import '@testing-library/jest-dom'
import { vi } from 'vitest';
// setupTests.js or equivalent setup file
if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = vi.fn();
} else {
  globalThis.fetch = vi.fn();
}

// Mock environment variables for tests
if (!import.meta.env.VITE_ENTRA_SCOPES) {
  import.meta.env.VITE_ENTRA_SCOPES = 'api://test/.default';
}
if (!import.meta.env.VITE_ENTRA_CLIENT_ID) {
  import.meta.env.VITE_ENTRA_CLIENT_ID = 'test-client-id';
}
if (!import.meta.env.VITE_ENTRA_AUTHORITY) {
  import.meta.env.VITE_ENTRA_AUTHORITY = 'https://login.microsoftonline.com/test';
}
if (!import.meta.env.VITE_WHOIS_API_URL) {
  import.meta.env.VITE_WHOIS_API_URL = 'https://test-whois-api.example.com';
}
if (!import.meta.env.VITE_STATES_PROVINCES_API_URL) {
  import.meta.env.VITE_STATES_PROVINCES_API_URL = 'https://test-states-api.example.com';
}


