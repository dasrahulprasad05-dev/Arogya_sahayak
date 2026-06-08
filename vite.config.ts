import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Aarogya Sahayak',
        short_name: 'Aarogya',
        description: 'AI Multilingual Preventive Health Companion',
        theme_color: '#0d9488',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              },
              networkTimeoutSeconds: 5
            }
          },
          {
            urlPattern: /\.(?:js|css|html|ico|png|jpg|jpeg|svg|gif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react') || id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            if (id.includes('@supabase/supabase-js') || id.includes('@supabase/postgrest-js') || id.includes('@supabase/realtime-js')) {
              return 'supabase';
            }
            if (id.includes('@tensorflow') || id.includes('mobilenet')) {
              return 'tfjs';
            }
          }
        }
      }
    }
  }
})
