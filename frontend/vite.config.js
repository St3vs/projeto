import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
   base: './',
   plugins: [
      react({
         jsxRuntime: 'classic'
      })
   ],
   resolve: {
      dedupe: ['react', 'react-dom']
   }, 
   server: {
      port: 3000,
   },
      build: {
      outDir: 'dist', 
   },
});