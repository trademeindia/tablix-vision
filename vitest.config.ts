
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/tests/setupTests.ts'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        exclude: [
          'node_modules/',
          'src/tests/',
          '**/*.d.ts',
        ],
      },
    },
  })
);
