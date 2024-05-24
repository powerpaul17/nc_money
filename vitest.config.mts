import { defineConfig, configDefaults } from 'vitest/config';

import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*']
    },
    exclude: [...configDefaults.exclude],
    server: {
      deps: {
        inline: ['@nextcloud/vue']
      }
    }
  }
});
