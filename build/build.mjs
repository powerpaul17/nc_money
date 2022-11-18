import { dirname, resolve } from 'path';

import { build } from 'vite';

import vue2 from '@vitejs/plugin-vue2';
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
      vue2()
    ]
  });
});
