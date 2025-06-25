import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
// 开启自动导入的支持
import AutoImport from 'unplugin-auto-import/vite'
//开启按需加载支持
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
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
        resolvers: [ArcoResolver()]
        // eslintrc: {
        //   enabled: true,
        //   filepath: resolve('src/renderer/.eslintrc-auto-import.json'),
        //   globalsPropValue: true
        // }
      }),
      Components({
        resolvers: [
          ArcoResolver({
            sideEffect: true
          })
        ]
      }),
      vitePluginForArco({
        style: 'css'
      })
    ]
  }
})
