import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_name: text(),
  email: text(),
  phone: text(),
  supplier: text(),
  create_time: integer('create_time', { mode: 'timestamp' }),
  update_time: integer('update_time', { mode: 'timestamp' }),

})
