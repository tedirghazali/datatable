const fs = require('fs')
const { join, resolve } = require('path')
const edge = require('edge.js').default
const store = require('./src/store.js')
const settings = require('./settings.js')

edge.mount(join(__dirname, 'src/layouts'))
edge.mount(join(__dirname, 'src/pages'))

const routes = fs.readdirSync(resolve(__dirname, 'src/pages'))

;(async () => {
  
  for(let route of routes) {
    const html = await edge.render(route, store)
    const fileName = route.replace(/\.edge$/, '').toLowerCase()
    
    if (!fs.existsSync(resolve(__dirname, settings.renderDir))) {
      fs.mkdirSync(resolve(__dirname, settings.renderDir));
    }
    
    fs.writeFileSync(resolve(__dirname, `${settings.renderDir}/${fileName}.html`), html)
  }
  
})()
