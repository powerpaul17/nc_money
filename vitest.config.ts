import { defineConfig } from 'vitest/config';

import vue2 from '@vitejs/plugin-vue2';

export default defineConfig({
  plugins: [
    vue2()
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'istanbul'
    },
    exclude: [
      'node_modules',
      'src/vendor'
    ],
    alias: [
      // remove this when migration to vue 3 is complete
      {
        find: 'vue',
        replacement: 'vue/dist/vue.runtime.mjs',
      }
    ]
  }
});
