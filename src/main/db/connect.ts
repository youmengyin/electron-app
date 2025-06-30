import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'node:path'
import { generateDirPath, getAppHand } from '../utils'
import { APP_NAME, DB_CONFIG } from '../constants'
import type * as schema from './schema'
import Database from 'better-sqlite3'
import logger from '../logger'
import { is } from '@electron-toolkit/utils'

const DB_PATH = path.join(getAppHand(), APP_NAME, DB_CONFIG.dbFileName)
generateDirPath(DB_PATH)
// 初始化数据库目录
const sqlite = new Database(DB_PATH, {
  timeout: DB_CONFIG.timeout
})
export let db: BetterSQLite3Database<typeof schema>
/**
 * 连接数据库
 */
export const dbConnect = async () => {
  db = drizzle(sqlite)
  const result = await db.run('select 1')
  // 仅在生成环境中使用迁移流程(打包自动生成升级文件)，开发环境使用 npm run syncSchema 直接同步数据库
  logger.info('dbConnect', is.dev, result)
  logger.info('dbConnect', path.join(__dirname, '../../../migrations'))
  if (!is.dev) {
    try {
      await migrate(db, { migrationsFolder: path.join(__dirname, '../../../migrations') })
    } catch (e) {
      logger.error('dbConnect error ', e)
    }
  }
}
