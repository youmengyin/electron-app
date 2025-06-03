import { systemPreferences } from 'electron'

export function sAccessibilityGranted() {
  if (process.platform === 'win32') {
    return true
  }
  return systemPreferences.isTrustedAccessibilityClient(true)
}
