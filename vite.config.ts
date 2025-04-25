
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
      ],
    },
    optimizeDeps: {
      exclude: [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-darwin-arm64',
        '@rollup/rollup-linux-arm64-gnu',
        '@rollup/rollup-win32-x64-msvc',
        '@rollup/rollup-win32-ia32-msvc',
        '@rollup/rollup-linux-arm-gnueabihf',
        '@rollup/rollup-android-arm64',
        '@rollup/rollup-freebsd-x64',
        '@rollup/rollup-linux-arm64-musl',
        '@rollup/rollup-linux-x64-musl'
      ],
    },
    build: {
      commonjsOptions: {
        exclude: [
          '@rollup/rollup-linux-x64-gnu',
          '@rollup/rollup-darwin-x64',
          '@rollup/rollup-darwin-arm64',
          '@rollup/rollup-linux-arm64-gnu',
          '@rollup/rollup-win32-x64-msvc',
          '@rollup/rollup-win32-ia32-msvc',
          '@rollup/rollup-linux-arm-gnueabihf',
          '@rollup/rollup-android-arm64',
          '@rollup/rollup-freebsd-x64',
          '@rollup/rollup-linux-arm64-musl',
          '@rollup/rollup-linux-x64-musl'
        ],
      },
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
