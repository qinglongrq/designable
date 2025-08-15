import { Alias, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { GlobSync } from 'glob'
import { resolve } from 'path'
import fs from 'fs-extra'
import basicSsl from '@vitejs/plugin-basic-ssl'

const getWorkspaceAlias = () => {
  const basePath = resolve(__dirname, '../../../')
  const pkg = fs.readJSONSync(resolve(basePath, 'package.json')) || {}
  const alias: Alias[] = []
  const workspaces = pkg.workspaces
  if (Array.isArray(workspaces)) {
    workspaces.forEach((pattern) => {
      const { found } = new GlobSync(pattern, { cwd: basePath })
      found.forEach((name) => {
        try {
          const pkg = fs.readJSONSync(resolve(basePath, name, './package.json'))
          alias.push({
            find: pkg.name,
            replacement: resolve(basePath, name, './src'),
          })
        } catch (error) {}
      })
    })
  }
  return alias
}

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  plugins: [react(), basicSsl()],
  resolve: {
    alias: [
      { find: /^~/, replacement: '' },
      { find: '@', replacement: resolve(__dirname, 'src') },
      ...getWorkspaceAlias(),
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        charset: false,
      },
      scss: {
        javascriptEnabled: true,
        charset: false,
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://10.9.10.70:7033',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('代理请求:', req.method, req.url, '->', options.target + req.url.replace(/^\/api/, ''))
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('代理响应:', proxyRes.statusCode, req.url)
          })
          proxy.on('error', (err, req, res) => {
            console.log('代理错误:', err.message, req.url)
          })
        },
      },
    },
    cors: true,
  },
  build: {
    sourcemap: true,
    outDir: './build',
  },
})
