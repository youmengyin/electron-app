import type { BrowserWindowConstructorOptions } from 'electron'
import { BrowserWindow, ipcMain } from 'electron'

/**
 * 一个动态窗口池，总是至少保留一个备用 BrowserWindow。
 * 支持无限并发窗口（无上限）。
 */
export class WindowPool {
  private browserOpts: BrowserWindowConstructorOptions
  private loadTarget: string | (() => string)

  /**
   * 池中可用窗口长度
   */
  public available: BrowserWindow[] = []
  private inUse = new Set<BrowserWindow>()

  constructor(options: BrowserWindowConstructorOptions, target: string | (() => string)) {
    this.browserOpts = options
    this.loadTarget = target

    // 启动时预创建一个备用窗口
    this.createAndPrepare()
  }

  /** 内部：创建窗口、加载页面，然后加入备用列表 */
  private async createAndPrepare(): Promise<void> {
    const win = this.createWindow()
    this.available.push(win)
    const target = typeof this.loadTarget === 'function' ? this.loadTarget() : this.loadTarget

    try {
      await win.loadURL(target)
    } catch (_) {
      console.error('stop to load URL:', target)
    }
  }
  /** 内部：创建一个隐藏的 BrowserWindow，并绑定关闭清理逻辑 */
  private createWindow(): BrowserWindow {
    const opts: BrowserWindowConstructorOptions = {
      ...this.browserOpts,
      show: false
    }

    const win = new BrowserWindow(opts)
    console.log('create ', win.id)

    // 监听 'closed' 事件，确保销毁并从 inUse 中移除
    win.on('closed', () => {
      console.log('closed', win.id, win.isDestroyed())
      this.inUse.delete(win)
      win.destroy?.()
    })

    return win
  }
  /**
   * 获取一个窗口：取出一个备用（若无则先创建），
   * 并异步补充一个新的备用。
   */
  public async acquire(): Promise<BrowserWindow> {
    if (this.available.length === 0) {
      await this.createAndPrepare()
    }
    const win = this.available.shift() as BrowserWindow
    // 异步补充下一个备用
    this.createAndPrepare()
    this.inUse.add(win)
    win.show()
    return win
  }
  /** 立即销毁所有窗口，清空池 */
  public destoryAll() {
    this.available.forEach((w) => {
      if (!w.isDestroyed()) {
        w.destroy()
      }
    })
    this.inUse.forEach((w) => {
      if (!w.isDestroyed()) {
        w.destroy()
      }
    })

    this.available = []
    this.inUse.clear()
  }
}

let pool: WindowPool
/**
 * 初始化window缓冲池
 */
export function initWindowPool(): WindowPool {
  pool = new WindowPool(
    {
      width: 800,
      height: 600,
      webPreferences: { nodeIntegration: true }
    },
    'about:blank'
  )
  ipcMain.handle('open:window', async () => {
    const win = await pool.acquire()
    return win.id
  })
  return pool
}
