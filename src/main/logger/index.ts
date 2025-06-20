import { is } from '@electron-toolkit/utils'
import logger from 'electron-log'
import path from 'node:path'
import { getStaticPath } from '../utils'
import { APP_NAME } from '../constants'

/**
 * 支持下列日志等级
 * @type type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
 */

logger.transports.file.resolvePathFn = () => path.join(getStaticPath(APP_NAME), 'log', 'main.log')
const date = new Date()
const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
// 修改日志文件名
logger.transports.file.fileName = `${dateStr}.log`
// 修改日志格式
logger.transports.file.format =
  '[{y}-{m}-{d} {h}:{i}:{s}.{ms}][{processType}][{level}]{scope} {text}'
// 设置日志文件大小上限, 达到上限后备份文件并重命名未**.old.log,有且仅有一个备份文件
logger.transports.file.maxSize = 10 * 1024 * 1024

// 打包后禁用console输出
if (!is.dev) {
  logger.transports.console.level = false
}

export default logger
