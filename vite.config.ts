
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Extended list of Rollup platform-specific dependencies to exclude
const rollupExcludes = [
  '@rollup/rollup-linux-x64-gnu',
  '@rollup/rollup-linux-x64-musl',
  '@rollup/rollup-darwin-x64',
  '@rollup/rollup-darwin-arm64',
  '@rollup/rollup-win32-x64-msvc',
  '@rollup/rollup-win32-ia32-msvc',
  '@rollup/rollup-win32-arm64-msvc',
  '@rollup/rollup-linux-arm64-gnu',
  '@rollup/rollup-linux-arm64-musl',
  '@rollup/rollup-linux-arm-gnueabihf',
  '@rollup/rollup-android-arm64',
  '@rollup/rollup-android-arm-eabi',
  '@rollup/rollup-freebsd-x64',
  '@rollup/rollup-linux-ia32-gnu',
  '@rollup/rollup-linux-ia32-musl',
  '@rollup/rollup-sunos-x64',
  '@rollup/rollup-linux-riscv64-gnu'
];

export default defineConfig(({ mode }) => {
  const plugins = [react()];
  
  if (mode === 'development') {
    try {
      const { componentTagger } = require('lovable-tagger');
      plugins.push(componentTagger());
    } catch (e) {
      console.warn('Could not load lovable-tagger, continuing without it');
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
      ],
      fs: {
        strict: true,
      }
    },
    optimizeDeps: {
      exclude: rollupExcludes,
      esbuildOptions: {
        target: 'es2020'
      }
    },
    build: {
      commonjsOptions: {
        exclude: rollupExcludes,
      },
      rollupOptions: {
        external: rollupExcludes,
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || 
              warning.message.includes('Use of eval') ||
              warning.message.includes('rollup-plugin') ||
              warning.message.includes('@rollup/')) {
            return;
          }
          warn(warning);
        }
      }
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
