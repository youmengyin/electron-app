import { app } from 'electron'
import path, { dirname } from 'node:path'
import logger from '../logger'
import { existsSync, mkdirSync } from 'node:fs'

/**
 * 系统目录
 * 获取用户目录下appdata目录，win下指向C:\Users\用户名\AppData\Roaming
 * @returns string
 */
export const getAppHand = () => {
  return app.getPath('appData')
}

/**
 * 系统目录
 * 获取用户目录下userData（app）目录，win下指向C:\Users\用户名\AppData\Roaming\appname
 * @returns string
 */
export const getUserDataPath = () => {
  return app.getPath('userData')
}

/**
 *
 * @param pathDir 静态资源目录
 * @returns 静态资源目录路径
 */
export function getStaticPath(pathDir: string = 'resources') {
  const staticPath = path.join(app.getAppPath(), pathDir)
  return staticPath
}

/**
 * 生成文件夹
 */
export const generateDirPath = (dirString: string) => {
  try {
    const dir = dirname(dirString)
    if (!existsSync(dir)) {
      // 如果目录不存在，则创建目录
      mkdirSync(dir, { recursive: true })
    }
  } catch (error) {
    logger.error('Database connection error:', error)
    throw error
  }
}
