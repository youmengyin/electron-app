import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { update } from './modules/update'
import { createWindow } from './modules/windowPool'
import { queryDB } from './modules/db'
import { logger } from './modules/logger'
import { fsProxy } from './modules/fs'

// Custom APIs for renderer
const api = {
  // App methods
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  getVersions: () => ipcRenderer.invoke('app:getVersions'),
  createWindow,
  client: {
    platform: 'app',
    ip: () => ipcRenderer.invoke('client-ip')
  },
  queryDB,
  update,
  logger,
  fs: fsProxy
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('electronAPI', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.electronAPI = api
}
