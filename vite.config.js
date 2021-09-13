const { resolve } = require('path')
const { defineConfig } = require('vite')
const settings = require('./settings.js')

const routes = fs.readdirSync(path.resolve(__dirname, settings.renderDir))
const inputRoutes = {}

for(let route of routes) {
  const inputName = route.split('/')[0].replace(/\.html$/, '').toLowerCase()
  inputRoutes[inputName] = resolve(__dirname, route)
}

module.exports = defineConfig({
  build: {
    outDir: 'public',
    rollupOptions: {
      input: inputRoutes
    }
  }
})
