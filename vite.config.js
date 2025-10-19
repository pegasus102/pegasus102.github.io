import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This is the crucial line for a username.github.io repository
  base: '/', 
  build: {
    target: 'esnext'
  }
})
