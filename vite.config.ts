import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// Library build. Storybook uses its own config in .storybook/vite.config.ts.
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      include: ['src'],
      exclude: ['src/**/*.stories.ts'],
    }),
  ],
  publicDir: false,
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'keston-ui',
      formats: ['es'],
    },
    rollupOptions: {
      // Never bundle these — the consuming app provides them.
      external: ['vue', 'reka-ui', '@lucide/vue', 'clsx', 'tailwind-merge', /^@lucide\/vue\//],
    },
  },
})
