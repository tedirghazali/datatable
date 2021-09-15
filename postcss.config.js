const algacss = require('alga-css')

module.exports = {
  plugins: [
    algacss({
      extract: ['./src/pages/**/*.edge', './src/layouts/**/*.edge', './src/components/**/*.vue']
    })
  ]
}
