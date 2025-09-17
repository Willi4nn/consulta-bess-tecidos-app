// vite.config.js
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'; // 👈 Importe o plugin

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      // O manifest define como seu app se parece ao ser "instalado"
      manifest: {
        name: 'Bess Tecidos - Tabela',
        short_name: 'Bess Tecidos',
        description: 'Tabela de preços digital da Bess Tecidos para consulta offline.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      } 
    })
  ],
})