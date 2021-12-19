import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'serve' || command === 'dev') {
    return {
      plugins: [vue()],
      /*build: {
        rollupOptions: {
          input: {
            main: 'index.html'
          }
        }
      }*/
    }
  } else {
    // command === 'build'
    return {
      plugins: [vue()],
      build: {
        lib: {
          entry: 'src/vue/lib.ts',
          name: 'TedirTable',
          fileName: (format) => `tedir-table-vue.${format}.js`
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue'
            }
          }
        }
      }
    }
  }
})
