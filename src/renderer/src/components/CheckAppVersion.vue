<script setup lang="ts">
import { ref } from 'vue'
import pkg from '../../../../package.json'
/**
 * app升级状态  auto-update
 */
enum UPDATE_CODE {
  error = -1,
  checking = 0,
  updateAvaible = 1,
  updateNotAvaible = 2,
  downloadProgress = 3,
  updateDownloaded = 4
}

const dialogVisible = ref(false)
const update = window.electronAPI.update
const hasNewVersion = ref(false)
const downloadPercent = ref(0)
// 下载完成
const hasDownload = ref(false)
// 监听更新状态
update.onUpdateMsg(({ code, data }) => {
  console.log(code, data)
  if (code === UPDATE_CODE.updateAvaible) {
    hasNewVersion.value = true
  }
  if (code === UPDATE_CODE.downloadProgress) {
    downloadPercent.value = (data.transferred / data.total) * 100
  }
  if (code === UPDATE_CODE.updateDownloaded) {
    hasDownload.value = true
  }
})

const init = async () => {
  dialogVisible.value = true
}

/**
 * 检查新版本
 */
const checkHand = async () => {
  await update.setUrl('http://127.0.0.1:5500/')
  update.checkUpdate()
}

const download = () => {
  update.startDownload()
}

//install
const setup = () => {
  update.quitAndInstall()
}
const closeHand = () => {
  dialogVisible.value = false
}
defineExpose({
  init
})
</script>

<template>
  <ADialog v-model="dialogVisible" title="提示" width="30%" center>
    <div>打两个不同版本测试，并检查版本地址的指向新版本目录</div>
    <div>当前版本{{ pkg.version }}</div>
    <AButton @click="checkHand">检查</AButton>
    <AButton @click="download" :disabled="!hasNewVersion">下载</AButton>
    <AButton @click="setup" :disabled="!hasDownload">安装</AButton>
    <div>下载进度{{ downloadPercent }}</div>
    <template #footer>
      <AButton @click="closeHand">关闭</AButton>
    </template>
  </ADialog>
</template>
