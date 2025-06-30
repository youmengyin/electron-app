import { dbConnect } from './connect'

export const dbInit = async () => {
  await import('./controller/index')
  await dbConnect()
}
