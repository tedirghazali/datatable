import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'serve' || command === 'dev') {
    return {
      plugins: [
        vue({
          template: {
            compilerOptions: {
              // treat all tags with a dash as custom elements
              isCustomElement: tag => tag.includes('-')
            }
          }
        })
      ],
    }
  } else {
    // command === 'build'
    return {
      plugins: [
        vue({
          customElement: true,
          template: {
            compilerOptions: {
              isCustomElement: tag => tag.includes('-')
            }
          }
        })
      ],
      build: {
        lib: {
          entry: 'src/web/web.ts',
          name: 'TedirTable',
          fileName: (format) => `tedir-table-web.${format}.js`
        },
        outDir: 'dist/web',
        /*rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue'
            }
          }
        }*/
      }
    }
  }
})
