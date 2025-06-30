import updater from 'electron-updater'
import { UPDATE_CHANNEL, UPDATE_CODE } from '../constants'
import { app, ipcMain } from 'electron'
import { getStaticPath } from '../utils'
import path from 'node:path'

const { autoUpdater } = updater
// 多环境配置
if (!app.isPackaged) {
  autoUpdater.updateConfigPath = path.join(getStaticPath(''), 'dev-app-update.yml')
} else {
  autoUpdater.updateConfigPath = path.join(getStaticPath(''), 'app-update.yml')
}

let webContents
function initUpdater() {
  // 开发环境下可检查更新， 仅测试时开启
  autoUpdater.forceDevUpdateConfig = true
  // 配置提供更新的程序，及build中配置的url
  // autoUpdater.setFeedURL("http://127.0.0.1:5500")
  // 是否自动更新，如果为true，当可以更新时(update-available)自动执行更新下载。
  autoUpdater.autoDownload = false

  autoUpdater.on('error', (err) => sendStatus(UPDATE_CODE.error, err.message, 'error'))

  // 1. 在渲染进程里触发获取更新，执行更新检查。 (根据具体需求)
  ipcMain.on(UPDATE_CHANNEL.CHECK_UPDATE, () => {
    return autoUpdater.checkForUpdates()
  })
  // 2. 开始检查是否有更新
  autoUpdater.on('checking-for-update', () => sendStatus(UPDATE_CODE.checking, null, 'checking'))
  // 3. 发现可更新数据时
  autoUpdater.on('update-available', (info) => {
    // 4. 告诉渲染进程有更新，info包含新版本信息
    return sendStatus(UPDATE_CODE.updateAvaible, info, 'updateAvailable')
  })
  // 没有可更新数据时
  autoUpdater.on('update-not-available', () =>
    sendStatus(UPDATE_CODE.updateNotAvaible, null, 'updateNotAvailable')
  )

  // 7. 收到确认更新提示，执行下载
  ipcMain.on('confirm-update', () => {
    autoUpdater.downloadUpdate()
  })

  // 8. 下载进度，包含进度百分比、下载速度、已下载字节、总字节等
  // ps: 调试时，想重复更新，会因为缓存导致该事件不执行，下载直接完成，可找到C:\Users\xxx\AppData\Local\xxx-updater\pending下的缓存文件将其删除（这是我本地的路径）
  autoUpdater.on('download-progress', (progressInfo) =>
    sendStatus(UPDATE_CODE.downloadProgress, progressInfo, 'downloadProgress')
  )
  // 10. 下载完成，告诉渲染进程，是否立即执行更新安装操作
  autoUpdater.on('update-downloaded', () => {
    sendStatus(UPDATE_CODE.updateDownloaded)
    // 12. 立即退出并更新安装包
    ipcMain.on(UPDATE_CHANNEL.EXIT_AND_INSTALL, () => autoUpdater.quitAndInstall())
  })

  ipcMain.on(UPDATE_CHANNEL.MSG, async (event, _) => {
    webContents = event.sender
  })

  // 修改地址
  ipcMain.handle(UPDATE_CHANNEL.SET_URL, (e, url) => autoUpdater.setFeedURL(url))
}

function sendStatus(code, data?: any, arg?: any) {
  // 需要在渲染进程里面打印出来的日志
  const message = {
    error: '更新出错',
    checking: '正在检查更新',
    updateAvailable: '检测到新版本',
    downloadProgress: '下载中',
    updateNotAvailable: '无新版本'
  }
  // 状态推送方法, 会被渲染进程传入的回调函数替换
  webContents?.send?.(UPDATE_CHANNEL.MSG, { code, data, message: message[arg] ?? arg })
}

export { initUpdater }
