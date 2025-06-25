import { app, Menu, nativeImage, Tray } from 'electron'
import path from 'node:path'
import { getStaticPath } from './utils'

let tray: Tray | null = null
export function createTray(callback: () => void) {
  const icon = nativeImage.createFromPath(path.resolve(getStaticPath(), 'icon.png'))
  tray = new Tray(icon)
  // 创建托盘菜单
  const trayMenu = Menu.buildFromTemplate([
    {
      label: '开机启动',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: (menuItem) => {
        app.setLoginItemSettings({
          openAtLogin: menuItem.checked,
          path: process.execPath
        })
        console.log(menuItem, process.execPath)
      }
    },
    {
      label: `版本号: v${app.getVersion()}`,
      enabled: false
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        callback()
      }
    }
  ])
  // 设置托盘菜单
  tray.setContextMenu(trayMenu)
  tray.setToolTip('小桌宠')
}

// 销毁托盘
export function destroyTray() {
  tray?.destroy()
  tray = null
}
