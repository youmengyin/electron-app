import { defineConfig } from 'drizzle-kit'
import path, { dirname } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import pkg from './package.json'

const APP_NAME = pkg.name

// 需要确认databasePath 是否指向正确的数据库文件 DB_CONFIG.dbFileName区分了开发、生产文件名
// 开发环境
const databasePath = path.join(process.env.APPDATA ?? '', APP_NAME, 'autoLite.dev.db')

const generateDirPath = (dirString: string) => {
  try {
    const dir = dirname(dirString)
    if (!existsSync(dir)) {
      // 如果目录不存在，则创建目录
      mkdirSync(dir, { recursive: true })
    }
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

generateDirPath(databasePath)

export default defineConfig({
  dialect: 'sqlite', // "mysql" | "sqlite" | "postgresql" | "turso" | "singlestore"
  schema: './src/main/db/schema',
  out: './migrations',
  dbCredentials: {
    url: databasePath
  }
})
