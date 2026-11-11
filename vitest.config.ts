import { defineConfig } from 'vitest/config'

// Unit tests (e.g. src/lib/parseDate.test.ts). Plain TypeScript only, so no
// Vue or Tailwind plugins. Run with: pnpm test
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
})
