import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { tampermonkeyHeaderPlugin } from './plugins'

export default defineConfig({
  plugins: [
    vue(),
    tampermonkeyHeaderPlugin()
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/main.ts',
      name: 'ScrollbarSwitcher',
      fileName: 'main',
      formats: ['iife']
    },
    rollupOptions: {
      external: [],
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined
      }
    },
    minify: false,
    sourcemap: false,
    cssCodeSplit: true
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  css: {
    // 内联 CSS
    postcss: {
      plugins: []
    }
  }
}) 