/**
 * 数据库名称
 */

import { is } from '@electron-toolkit/utils'
import { SQL_TIMEOUT } from './common'

const DB_NAME = is.dev ? 'autoLite.dev.db' : 'autoLite.db'
/**
 * 数据库配置
 */
export const DB_CONFIG = {
  dbFileName: DB_NAME,
  timeout: SQL_TIMEOUT
}
