import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    alias: [{ find: /^src\/(.*)/, replacement: './src/$1' }],
  },
});
