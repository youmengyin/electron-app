import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import pkg from './package.json'

const define = {
  __APP_ID__: JSON.stringify('com.electron'),
  __APP_VERSION__: JSON.stringify(pkg.version),
  __IS_MAC__: JSON.stringify(process.platform === 'darwin')
}
export default defineConfig({
  main: {
    define,
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    define,
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      AutoImport({
        imports: [
          'vue',
          {
            pinia: ['storeToRefs', 'createPinia']
          },
          'vue-router',
          '@vueuse/core'
        ],
        dts: resolve('src/renderer/auto-imports.d.ts'),
        resolvers: []
        // eslintrc: {
        //   enabled: true,
        //   filepath: resolve('src/renderer/.eslintrc-auto-import.json'),
        //   globalsPropValue: true
        // }
      })
    ]
  }
})
