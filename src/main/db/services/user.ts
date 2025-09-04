import { eq } from 'drizzle-orm'
import { db } from '../connect'
import { users } from '../schema'
import { response } from '../response'

export class userServices {
  static async getUserById(id: number) {
    const info = await db.select().from(users).where(eq(users.id, id))

    if (!info) {
      return response.error({ msg: '用户不存在' })
    }
    return response.ok({ data: info?.[0] })
  }
  /**根据id更新用户详情 */
  static async updateUserById(id: number, data: any) {
    return await db.transaction( (tx) => {
      const user =  db.update(users).set(data).where(eq(users.id, id)).run()
      if (!user) {
        tx.rollback()
        return response.error()
      }
      return response.ok()
    })
  }

  /**新增用户详情 */
  static async insertUser(data: any) {
      const user  = await db.insert(users).values(data)
      if (!user) {
        return response.error()
      }
      return response.ok()
  }

  /**
   * 获取用户列表
   * @returns
   */
  static async getUserList() {
    const list = await db.select().from(users)
    return response.ok({ data: list ?? [] })
  }

  /**
   * 根据id删除用户
   */
  static async deleteUserById(id: number) {
    return await db.transaction(async (tx) => {
      const user = await db.delete(users).where(eq(users.id, id))
      if (!user) {
        tx.rollback()
        return response.error()
      }
      return response.ok()
    })
  }
}
