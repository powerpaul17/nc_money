import { resolve } from 'path';

import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueI18N from '@intlify/vite-plugin-vue-i18n';

const vueDocsPlugin = {
  name: 'vue-docs',
  load(id) {
    if (!/vue&type=docs/.test(id)) {
      return null;
    }
    return 'export default {}';
  }
};

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
    define: {
      TRANSLATIONS: 'Array.from([])'
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use 'sass:math';
            @import './src/vendor/nextcloud-vue/src/assets/variables';
            @import './src/vendor/nextcloud-vue/src/assets/material-icons';
          `
        }
      }
    },
    resolve: {
      alias: [
        {
          find: /vue-material-design-icons\/(.*)/,
          replacement: resolve('node_modules/vue-material-design-icons') + '/$1'
        }
      ]
    },
    plugins: [
      vueDocsPlugin,
      vue(),
      vueI18N({
        compositionOnly: false,
        include: './src/locales/**'
      })
    ],
    test: {
      coverage: {
        provider: 'istanbul'
      },
      exclude: ['node_modules', 'src/vendor']
    }
  };
});
