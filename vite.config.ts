import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@creit.tech/stellar-wallets-kit/modules/utils': path.resolve(
        process.cwd(),
        'node_modules/@creit.tech/stellar-wallets-kit/esm/sdk/modules/utils.js'
      ),
    },
  },
  preview: {
    allowedHosts: ["cloudycoding.com", "cosmos.cloudycoding.com"]
  }
})