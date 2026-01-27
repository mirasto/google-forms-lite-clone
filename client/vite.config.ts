import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url';
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@config': fileURLToPath(new URL('./src/config', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/shared/types.ts', import.meta.url)),
      '@constants': fileURLToPath(new URL('./src/shared/constants.ts', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['@forms/shared'],
  },
})