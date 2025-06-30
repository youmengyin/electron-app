import { ipcRenderer } from 'electron'

/**
 * 创建一个window
 * @returns 当前窗口的id
 */
export const createWindow = (): Promise<string> => {
  return ipcRenderer.invoke('open:window')
}
