import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    WindiCSS(),
  ],
  resolve: {
    alias: {
      "@":path.resolve(__dirname, "src")
    }
  },
  server: {
    port: 8899,
    // open: true,
    // 允许跨域
    cors: true,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})
