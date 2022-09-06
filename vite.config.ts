import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueI18N from '@intlify/vite-plugin-vue-i18n';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      lib: {
        entry: './src/main.ts',
        fileName: 'money-main',
        name: 'money',
        formats: ['iife']
      },
      outDir: './js',
      minify: mode === 'development' ? false : 'esbuild',
      sourcemap: mode === 'development' ? true : false
    },
    plugins: [
      vue(),
      vueI18N({
        compositionOnly: false,
        include: './src/locales/**'
      })
    ],
    test: {
      coverage: {
        provider: 'istanbul'
      }
    }
  };
});
