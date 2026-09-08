import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/cases': 'http://localhost:4000',
      '/dashboard': 'http://localhost:4000',
      '/union': 'http://localhost:4000',
      '/training': 'http://localhost:4000',
      '/redundancy': 'http://localhost:4000',
      '/reports': 'http://localhost:4000',
      '/ai': 'http://localhost:4000',
      '/alerts': 'http://localhost:4000',
      '/users': 'http://localhost:4000',
      '/audit': 'http://localhost:4000',
      '/auth': 'http://localhost:4000'
    }
  },
});
