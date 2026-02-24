import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SdkworkAiSDK',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      external: ['axios'],
    },
  },
  plugins: [
    dts({
      include: ['src/**/*'],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
});
