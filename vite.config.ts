import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      lib: {
        entry: './src/main.ts',
        fileName: 'money-main',
        name: 'money',
        formats: [ 'iife' ]
      },
      outDir: './js',
      minify: mode === 'development' ? false : 'esbuild',
      sourcemap: mode === 'development' ? true : false
    },
    plugins: [
      vue()
    ]
  };
});
