import { defineConfig } from 'vitest/config';

import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue()
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
    ]
  }
});
