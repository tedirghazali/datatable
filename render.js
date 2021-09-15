const fs = require('fs')
const { join, resolve } = require('path')
const edge = require('edge.js').default
const store = require('./src/store.js')
const settings = require('./settings.js')

edge.mount(join(__dirname, 'src/layouts'))
edge.mount(join(__dirname, 'src/pages'))

if (fs.existsSync(resolve(__dirname, settings.renderDir))) {
  fs.rmdirSync(resolve(__dirname, settings.renderDir), { recursive: true });
}
fs.mkdirSync(resolve(__dirname, settings.renderDir));
fs.chmodSync(resolve(__dirname, settings.renderDir), 0o777)

const routes = fs.readdirSync(resolve(__dirname, 'src/pages'))

;(async () => {
  
  for(let route of routes) {
    const fileName = route.replace(/\.edge$/, '')
    const html = await edge.render(fileName, store)
    
    fs.writeFileSync(resolve(__dirname, `${settings.renderDir}/${fileName.toLowerCase()}.html`), html)
  }
  
})()
