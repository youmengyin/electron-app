import { Notification, type NotificationConstructorOptions } from 'electron'

export function showNotification(options: NotificationConstructorOptions) {
  const notification = new Notification({ ...options })
  notification.show()
  return notification
}
