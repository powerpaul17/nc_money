import { dirname, resolve } from 'path';

import { build } from 'vite';

import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

const vueDocsPlugin = {
  name: 'vue-docs',
  load(id) {
    if (!/vue&type=docs/.test(id)) {
      return null;
    }
    return 'export default {}';
  }
};

const __dirname = dirname(fileURLToPath(import.meta.url));

const bundles = [
  {
    entry: resolve(__dirname, '../src/main.ts'),
    name: 'moneyMain',
    fileName: 'money-main'
  }
];

const mode = process.env.VITE_MODE ?? 'production';

// TODO give this value some meaning, needed for nextcloud vue components
const SCOPE_VERSION = '123';

bundles.forEach(async (bundle) => {
  await build({
    build: {
      lib: {
        ...bundle,
        formats: [ 'iife' ]
      },
      outDir: './js',
      minify: mode === 'development' ? false : 'esbuild',
      sourcemap: mode === 'development' ? true : false,
      emptyOutDir: false
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
    ]
  });
});
