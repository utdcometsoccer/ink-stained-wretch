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
      enabled: false,
      provider: 'playwright',
      instances: [
        { browser: 'chromium' },
      ],
    },
    env: {
      VITE_STATES_PROVINCES_API_URL: 'http://localhost:7001/api/stateprovinces',
      VITE_PENGUIN_RANDOM_HOUSE_TITLES_BY_AUTHOR_API_URL: 'http://localhost:7001/api/penguin/{authorKey}/titles',
      VITE_AMAZON_BOOKS_API_URL: 'http://localhost:7001/api/amazon/books/author',
      VITE_COUNTDOWN_SECONDS: '10',
      VITE_COUNTRIES_API_URL: 'http://localhost:7001/api/countries',
      VITE_DOMAIN_REGISTRATION_SUBMIT_API_URL: 'http://localhost:7001/api/domains',
      VITE_LANGUAGES_API_URL: 'http://localhost:7001/api/languages',
      VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_mock',
      VITE_ENTRA_SCOPES: 'api://test/scope',
      VITE_WHOIS_API_URL: 'http://localhost:7001/api/whois'
    }
  }
})
