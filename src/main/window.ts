import { is } from '@electron-toolkit/utils'
import { BrowserWindow, type BrowserWindowConstructorOptions, shell } from 'electron'
import { join } from 'node:path'

type WindowId = 'main' | 'panel' | 'setup'

export const WINDOWS = new Map<WindowId, BrowserWindow>()
function createBaseWindow({
  id,
  url,
  showWhenReady = true,
  windowOptions = {}
}: {
  id: WindowId
  url?: string
  showWhenReady?: boolean
  windowOptions?: BrowserWindowConstructorOptions
}) {
  const window = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...windowOptions,
    webPreferences: {
      // nodeIntegration: true, // 允许渲染进程使用 Node.js API
      // contextIsolation: false, // 关闭上下文隔离
      // webSecurity: false, // 关闭跨域限制
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      ...windowOptions?.webPreferences
    }
  })

  WINDOWS.set(id, window)
  if (showWhenReady) {
    window.on('ready-to-show', () => {
      window.show()
    })
  }
  window.on('close', () => {
    console.log('关闭窗口', id)
    WINDOWS.delete(id)
  })
  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    window.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }
  return window
}

export function createMainWindow({ url }: { url?: string }) {
  const window = createBaseWindow({
    id: 'main',
    url,
    showWhenReady: true,
    windowOptions: {
      titleBarStyle: 'hiddenInset'
    }
  })

  return window
}
