import { dirname, resolve } from 'path';

import { build } from 'vite';

import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const bundles = [
  {
    entry: resolve(__dirname, '../src/main.ts'),
    name: 'moneyMain',
    fileName: 'money-main'
  },
  {
    entry: resolve(__dirname, '../src/main-personal-settings.ts'),
    name: 'moneyPersonalSettings',
    fileName: 'money-personal-settings'
  },
  {
    entry: resolve(__dirname, '../src/main-dashboard.ts'),
    name: 'moneyDashboard',
    fileName: 'money-dashboard'
  }
];

const mode = process.env.VITE_MODE ?? 'production';

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
      emptyOutDir: false,
      rollupOptions: {
        output: {
          assetFileNames: `${bundle.fileName}.css`
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
      vue()
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    }
  });
});
