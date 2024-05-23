import { defineConfig, configDefaults } from 'vitest/config';

import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'istanbul'
    },
    exclude: [...configDefaults.exclude, 'src/vendor'],
    alias: [
      // remove this when migration to vue 3 is complete
      {
        find: 'vue',
        replacement: 'vue/dist/vue.runtime.mjs'
      }
    ]
  }
});
