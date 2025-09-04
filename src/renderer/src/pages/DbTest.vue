<template>
  <a-modal v-model:visible="visible" title="添加/修改" width="600px" destroy-on-close @close="closeHand">
    <a-form ref="formRef" :model="dataForm">
      <a-form-item prop="user_name" label="姓名">
        <a-input v-model="dataForm.user_name"></a-input>
      </a-form-item>
      <a-form-item prop="email" label="邮箱">
        <a-input v-model="dataForm.email"></a-input>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="closeHand">取消</a-button>
      <a-button @click="submit" type="primary">确认</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
  import { addOrUpdateUserDB, getUserInfoByIdDB } from '@renderer/api/user'
  import { Message } from '@arco-design/web-vue'
  import { reactive, ref } from 'vue'

  let visible = ref(false)

  let dataForm = reactive({
    id: '',
    user_name: '',
    email: ''
  })
  const init = (row?: any) => {
    visible.value = true
    dataForm.id = row?.id || ''
    if (dataForm.id) {
      getInfoHand()
    }
  }

  /**
   * 获取详情
   */
  const getInfoHand = async () => {
    let parmas = {
      id: dataForm.id
    }
    let { code, data } = await getUserInfoByIdDB(parmas)
    if (code === 200) {
      dataForm.user_name = data.user_name
      dataForm.email = data.email
      dataForm.id = data.id
    }
  }

  // 提交
  const submit = async () => {
    if (!dataForm.user_name || !dataForm.email) return
    let parmas = {
      id: dataForm.id,
      user_name: dataForm.user_name,
      email: dataForm.email
    }
    const { code  } = await addOrUpdateUserDB(parmas)
    if (code == 200) {
      Message.success('操作成功')
      closeHand()
      emits('success')
    }
  }

  let formRef = ref()
  const closeHand = () => {
    formRef.value.resetFields?.()
    visible.value = false
  }

  const emits = defineEmits(['success'])

  defineExpose({
    init
  })
</script>

<style lang="scss" scoped></style>
