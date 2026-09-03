import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'taskflowFinal'
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: isGitHubPages ? `/${repoName}/` : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://d3ujwk09smrk9z.cloudfront.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})