/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {      
      reporter: ['text', 'json', 'html'],
      enabled: true
    },
    globals: true,
    setupFiles: './setupTests.ts',
    environment: 'jsdom',
    bail: 1,
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        { browser: 'chromium' },
      ],
    }
  }
})
