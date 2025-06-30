<script setup lang="ts">
import CheckAppVersion from '@renderer/components/CheckAppVersion.vue'

function handleSendIPC() {
  window.electron.ipcRenderer.send('ping')
}
// async function checkVersion() {
//   const res = await window.electronAPI.update.checkUpdate()
//   console.log(res)
// }
const checkRef = useTemplateRef<typeof CheckAppVersion>('checkRef')
/**
 * 检查新版本
 */
const checkVersion = () => {
  checkRef.value?.init()
}
function createWindowHand() {
  window.electronAPI.createWindow()
}
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div class="flex items-center gap-4">
      <div class="mb-10">
        <AButton @click="checkVersion" type="text">检查app版本</AButton>
        <AButton @click="createWindowHand">创建window</AButton>
      </div>
      <CheckAppVersion ref="checkRef" />
      <RouterLink
        class="border border-primary-500 rounded-md px-2 py-1 text-primary-500 transition-colors dark:border-white hover:bg-primary-500 dark:text-white hover:text-white dark:hover:text-white"
        to="/about"
      >
        About
      </RouterLink>
      <a
        @click="handleSendIPC"
        class="cursor-pointer border border-primary-500 rounded-md px-2 py-1 text-primary-500 transition-colors dark:border-white hover:bg-primary-500 dark:text-white hover:text-white dark:hover:text-white"
        target="_blank"
        rel="noreferrer"
      >
        Send IPC
      </a>
    </div>
  </div>
</template>
