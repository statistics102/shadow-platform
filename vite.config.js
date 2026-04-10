import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'  // 👈 أضف هذا السطر

export default defineConfig({
  base: '/shadow-platform/',
  logLevel: 'error',
  resolve: {  // 👈 أضف هذا القسم بالكامل
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  plugins: [
    base44({
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ]
});
