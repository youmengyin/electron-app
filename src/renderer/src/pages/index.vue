<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue'
import { deleteUserByIdDB, getUserListDB } from '@renderer/api/user'
import CheckAppVersion from '@renderer/components/CheckAppVersion.vue'
import DbTest from './DbTest.vue'

const logger = window.electronAPI.logger
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

  let tableData = ref([])
  /**
   * 获取用户列表
   */
  const getUserListHand = async () => {
    logger.info('获取用户列表')
    let { code, data } = await getUserListDB()
    if (code == 200) {
      tableData.value = data
    }
  }

  let addRef = useTemplateRef('addRef')
  const addHand = () => {
    addRef.value!.init()
  }
    const columns = [
      {
        title: '用户名',
        dataIndex: 'user_name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '操作',
        width: 180,
        slotName: 'operate'
      }
    ];
  const changeHand = (row: any) => {
    addRef.value!.init(row)
  }

  const deleteHand = (row: any) => {
    Modal.confirm(
      {
        okText: '确定',
        cancelText: '取消',
        title: '提示',
        content: '确定删除吗？',
        onOk: async () => {
          let parmas = {
            id: row.id
          }
          let { code, } = await deleteUserByIdDB(parmas)
          if (code == 200) {
            Message.success('删除成功')
            getUserListHand()
          }

        }
      }
    )
  }
  onMounted(() => {
    getUserListHand()
  })

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
      <a-button @click="getUserListHand">查询用户</a-button>
      <a-button @click="addHand">新增用户</a-button>
      <a-table style="margin-top: 20px" stripe :data="tableData" :columns="columns">

        <!-- <a-table-column prop="id" label="id" width="180"></a-table-column>
        <a-table-column prop="user_name" label="姓名"></a-table-column>
        <a-table-column prop="email" label="邮箱"></a-table-column> -->
        <template #operate="{ record, rowIndex }">
          <a-button text type="primary" @click="changeHand(record)">修改</a-button>
          <a-button type="text" status="danger" @click="deleteHand(record)">删除</a-button>
        </template>

      </a-table>
      <DbTest @success="getUserListHand" ref="addRef"></DbTest>
    </div>
  </div>
</template>
