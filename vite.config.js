import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import newsHandler from './api/news.js'

// Vite plugin to mock Vercel serverless function /api/upload and /api/news during local development
const localApiProxy = () => ({
  name: 'local-api-proxy',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/news' && req.method === 'GET') {
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };
        try {
          await newsHandler(req, res);
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ status: 'error', message: e.message }));
        }
        return;
      }

      if (req.url === '/api/upload' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body);
            // Catbox.moe requires multipart/form-data
            const buffer = Buffer.from(parsed.image, 'base64');
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            formData.append('fileToUpload', blob, 'upload_' + Date.now() + '.jpg');

            const proxyRes = await fetch('https://catbox.moe/user/api.php', {
              method: 'POST',
              body: formData
            });
            
            const resultText = await proxyRes.text();
            res.setHeader('Content-Type', 'application/json');
            
            if (resultText.startsWith('https://')) {
              res.end(JSON.stringify({ success: true, url: resultText }));
            } else {
              res.end(JSON.stringify({ success: false, error: 'Catbox upload failed' }));
            }
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
        });
      } else {
        next();
      }
    });
  }
});

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), localApiProxy()],
  build: {
    chunkSizeWarningLimit: 1600,
  }
})
