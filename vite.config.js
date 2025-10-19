import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Change 'my-portfolio' to your exact GitHub repository name
  base: '/', 
  build: {
    target: 'esnext'
  }
})