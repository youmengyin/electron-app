import type { ElectronAPI } from '@electron-toolkit/preload'

declare interface UpdateAPI {
  onUpdateMsg: (callback: () => void) => void
  checkUpdate: () => Promise<void>
}
declare interface API {
  getVersion: () => Promise<string>
  getPlatform: () => Promise<string>
  getVersions: () => Promise<{ node: string; electron: string; chrome: string }>
  update: UpdateAPI
  createWindow: () => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    electronAPI: API
  }
}
