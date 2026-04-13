import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import AdmZip from 'adm-zip'
import fs from 'fs'

function createZipPlugin() {
  return {
    name: 'create-zip-plugin',
    configureServer() {
      // This will run when Vite starts/restarts
      try {
        const publicDir = path.resolve(__dirname, 'public');
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        
        const zipPath = path.resolve(publicDir, 'requin-web.zip');
        if (fs.existsSync(zipPath)) {
          fs.unlinkSync(zipPath);
        }

        const zip = new AdmZip();
        
        // Add directories
        if (fs.existsSync(path.resolve(__dirname, 'src'))) {
          zip.addLocalFolder(path.resolve(__dirname, 'src'), 'src');
        }
        
        // Add important root files
        const filesToAdd = [
          'package.json',
          'vite.config.ts',
          'index.html',
          'postcss.config.mjs',
          'tsconfig.json',
          'tsconfig.node.json'
        ];
        
        for (const file of filesToAdd) {
          const filePath = path.resolve(__dirname, file);
          if (fs.existsSync(filePath)) {
            zip.addLocalFile(filePath);
          }
        }
        
        zip.writeZip(zipPath);
        console.log('Successfully created requin-web.zip in public folder!');
      } catch (err) {
        console.error('Failed to create zip file:', err);
      }
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    createZipPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
