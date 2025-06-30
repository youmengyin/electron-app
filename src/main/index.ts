import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'node:path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createAppMenu } from './menu'
import { createMainWindow } from './window'
import { createTray, destroyTray } from './tray'
import { release } from 'node:os'
import type { WindowPool } from './window-pool/windowPool'
import { initWindowPool } from './window-pool/windowPool'
import logger from './logger'
import { initUpdater } from './auto-update'
import { dbInit } from './db/init'

function createWindow(): void {
  console.log(__APP_VERSION__, __APP_ID__, __IS_MAC__)

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
      // default
      // nodeIntegration: false, // 关闭 nodeIntegration（更安全）
      // contextIsolation: true // 启用 contextIsolation
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 顶部菜单栏
  // Menu.setApplicationMenu(null)
  // 打开开发工具
  // mainWindow.webContents.openDevTools()
}
let windowPool: WindowPool
// 关闭安全提示
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
// 忽略证书相关错误
app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors') // 允许跨域
// win7下禁用gpu加速
if (release().startsWith('6.1')) {
  app.disableHardwareAcceleration()
}
console.log(release())

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  logger.info('主进程初始化')
  // Set app user model id for windows
  electronApp.setAppUserModelId(__APP_ID__)

  Menu.setApplicationMenu(createAppMenu())
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  dbInit()
  // createWindow()
  createMainWindow({})
  createTray(() => {
    destroyTray()
    app.quit()
  })

  windowPool = initWindowPool()
  // app.on('activate', function () {
  //   // 在 macOS 系统内, 如果没有已开启的应用窗口
  //   // 点击托盘图标时通常会重新创建一个新窗口
  //   if (BrowserWindow.getAllWindows().length === 0) {
  //     createWindow()
  //   }
  // })
  app.on('activate', function () {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === windowPool.available?.length) {
      createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
/**
 * 所有窗口被关闭时, mac上使用command + Q 关闭窗口
 * 因缓冲池中存在窗口，所以不退出程序
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    destroyTray()
    app.quit()
  }
})
app.on('before-quit', () => {
  windowPool.destoryAll()
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

initUpdater()
