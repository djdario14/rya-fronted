import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Intenta cargar certificados locales si existen
let httpsConfig = undefined;
try {
  const keyPath = path.resolve(__dirname, 'localhost-key.pem');
  const certPath = path.resolve(__dirname, 'localhost-cert.pem');
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    httpsConfig = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }
} catch (e) {}

export default defineConfig({
  plugins: [react()], // react() ya activa el nuevo JSX transform
  server: {
    port: 3000,
    https: httpsConfig,
    allowedHosts: [
      "rya-cobranza.up.railway.app",
      "unmonetary-antone-nonspontaneously.ngrok-free.dev"
    ],
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  preview: {
    host: true,
    allowedHosts: [
      "rya-cobranza.up.railway.app",
      "unmonetary-antone-nonspontaneously.ngrok-free.dev"
    ]
  }
});
