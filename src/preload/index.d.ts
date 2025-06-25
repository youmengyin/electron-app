import type { ElectronAPI } from '@electron-toolkit/preload'

declare interface UpdateAPI {
  onUpdateMsg: (callback: () => void) => void
  checkUpdate: () => Promise<void>
}
interface QueryDBType {
  path: string
  params?: Record<string, any>
  timeout?: number
}
declare interface API {
  getVersion: () => Promise<string>
  getPlatform: () => Promise<string>
  getVersions: () => Promise<{ node: string; electron: string; chrome: string }>
  update: UpdateAPI
  createWindow: () => Promise<string>
  queryDB: (query: QueryDBType) => Promise<any>
}

declare global {
  interface Window {
    electron: ElectronAPI
    electronAPI: API
  }
}
