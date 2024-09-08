<template>
  <div class="flex items-center justify-center h-screen">
    <el-card class="w-96">
      <h2 class="text-center text-2xl mb-4">忘记密码</h2>
      <el-form :model="form" ref="formRef" label-width="100px">
        <el-form-item label="邮箱" prop="email" :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleResetPassword">重置密码</el-button>
          <el-button @click="$router.push('/')">返回登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const form = ref({
      email: ''
    });

    const handleResetPassword = () => {
      // 调用后端重置密码接口
      console.log('重置密码:', form.value);
    };

    return {
      form,
      handleResetPassword
    };
  },
};
</script>

<style scoped>
/* 添加一些自定义样式 */
</style>