<script setup lang="ts">
import Versions from './components/Versions.vue'

const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<template>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <div class="actions">
    <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
    </div>
    <div class="action">
      <a @click="ipcHandle" target="_blank" rel="noreferrer">Send IPC</a>
    </div>
  </div>
  <RouterView />
  <Versions />
</template>
