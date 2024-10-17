import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Exclude the playwrightTests directory
    exclude: ['playwrightTests/**'],
  },
});
