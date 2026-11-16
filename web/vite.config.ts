import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Tesseract.js is lazy-imported so its chunk sits at ~922 kB; bump the
    // warning threshold to avoid spurious noise. The import() in Audit.tsx
    // already ensures it is split into its own chunk and not in the main bundle.
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Keep AI/OCR libraries in a dedicated vendor chunk separate from app code
        manualChunks(id) {
          if (id.includes('tesseract.js') || id.includes('tesseract-core')) {
            return 'vendor-ocr'
          }
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase'
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router'
          }
        },
      },
    },
  },
})
