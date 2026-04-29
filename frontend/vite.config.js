import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // This allows you to use 'test', 'expect', 'beforeAll' without importing them
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      enabled: true,
      provider: 'istanbul',
    }
  },
})
