<script setup lang="ts">
function handleSendIPC() {
  window.electron.ipcRenderer.send('ping')
}
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div class="flex items-center gap-4">
      <RouterLink
        class="border border-primary-500 rounded-md px-2 py-1 text-primary-500 transition-colors dark:border-white hover:bg-primary-500 dark:text-white hover:text-white dark:hover:text-white"
        to="/about"
      >
        About
      </RouterLink>
      <a
        class="cursor-pointer border border-primary-500 rounded-md px-2 py-1 text-primary-500 transition-colors dark:border-white hover:bg-primary-500 dark:text-white hover:text-white dark:hover:text-white"
        target="_blank"
        rel="noreferrer"
        @click="handleSendIPC"
      >
        Send IPC
      </a>
    </div>
  </div>
</template>
