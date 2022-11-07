import { resolve } from 'path';

import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

const vueDocsPlugin = {
  name: 'vue-docs',
  load(id) {
    if (!/vue&type=docs/.test(id)) {
      return null;
    }
    return 'export default {}';
  }
};

// TODO give this value some meaning, needed for nextcloud vue components
const SCOPE_VERSION = '123';

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
    define: {
      SCOPE_VERSION,
      TRANSLATIONS: 'Array.from([])'
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use 'sass:math';
            $scope_version:${SCOPE_VERSION};
            @import './src/vendor/nextcloud-vue/src/assets/variables';
            @import './src/vendor/nextcloud-vue/src/assets/material-icons';
          `
        }
      }
    },
    resolve: {
      alias: [
        {
          find: /^~(.*)/,
          replacement: '$1'
        },
        {
          find: /vue-material-design-icons\/(.*)/,
          replacement: resolve('node_modules/vue-material-design-icons') + '/$1'
        }
      ]
    },
    plugins: [
      vueDocsPlugin,
      vue()
    ],
    test: {
      environment: 'jsdom',
      coverage: {
        provider: 'istanbul'
      },
      exclude: [ 'node_modules', 'src/vendor' ]
    }
  };
});
