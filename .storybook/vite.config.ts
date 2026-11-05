import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Vite config for Storybook only (no library build or type generation).
export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
