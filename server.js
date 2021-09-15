const fs = require('fs')
const { join, resolve } = require('path')
const edge = require('edge.js').default
const express = require('express')
const store = require('./src/store.js')
const settings = require('./settings.js')
const { createServer: createViteServer } = require('vite')

edge.mount(join(__dirname, 'src/layouts'))
edge.mount(join(__dirname, 'src/pages'))

async function createServer() {
  const app = express()

  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  })
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    const url = req.originalUrl
    
    try {
      let route = url === '/' ? '/index' : url
      if(route.charAt(0) === '/') {
        route = route.slice(1)
      }
      if(route.charAt(Number(route.length) - 1) === '/') {
        route = route.slice(0, Number(route.length) - 1)
      }
      const html = await edge.render(route, store)
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  app.listen(3000)
}

createServer()

