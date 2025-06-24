import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('react')) return 'react';
          if (id.includes('chart.js')) return 'chartjs'; // Add any other heavy lib here
          if (id.includes('lodash')) return 'lodash';
        },
      },
    },
  },
});
