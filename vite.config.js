import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


const ReactCompilerConfig = {
  reactCompiler: true,
};

export default defineConfig({
  plugins: [react({
    babel: {
      plugins: ['babel-plugin-react-compiler'],
    },
  }), tailwindcss()],
  server:{
    port:5173
  }, 
  preview:{
    host:"10.10.10.120", 
    port:5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // External libs split
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
