import { Menu } from 'electron'
import type { MenuItem, MenuItemConstructorOptions } from 'electron'

export function createAppMenu() {
  const template: MenuItemConstructorOptions | MenuItem[] = []

  return Menu.buildFromTemplate(template)
}
