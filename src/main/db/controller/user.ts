import { ipcMain } from 'electron'
import { userServices } from '../services/user'

/**
 * 获取用户列表
 */
ipcMain.handle('db/user/getList', async (__, _) => {
  return await userServices.getUserList()
})
/**
 * 根据id删除用户
 */
ipcMain.handle('db/user/deleteById', async (event, { id }) => {
  return await userServices.deleteUserById(id)
})
/**
 * 根据用户id获取用户信息
 */
ipcMain.handle('db/user/getInfoById', async (event, { id }) => {
  return await userServices.getUserById(id)
})

/**
 * 新增或更新用户
 */
ipcMain.handle('db/user/addOrUpdate', async (event, arg) => {
  const data = arg
  let res
  if (data.id) {
    res = await userServices.updateUserById(data.id, data)
  } else {
    const newData = { ...data }
    delete newData.id
    res = await userServices.insertUser(newData)
  }
  return res
})
