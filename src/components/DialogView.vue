<template>
  <el-dialog
      :model-value="dialogVisible"
      :title="dialogTitle"
      width="40%"
      @close="handleClose">
    <el-form ref="formRef" :model="form" label-width="70px" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="file">
        <el-upload
            class="upload-demo"
            drag
            :on-change="handleFileChange"
            :show-file-list="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-image
            v-if="form.image_url"
            :src="form.image_url"
            style="max-width: 200px; max-height: 200px;"
            fit="cover"
            alt="Uploaded Image">
        </el-image>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits, ref, defineProps, watch } from 'vue';
import { addUser, editUser } from '@/api/users'; // Ensure these methods are handled accordingly
import { ElMessage } from 'element-plus';

const props = defineProps({
  dialogTitle: {
    type: String,
    default: '',
    required: true
  },
  dialogTableValue: {
    type: Object,
    default: () => ({})
  }
});

const emits = defineEmits(['update:modelValue', 'initUserList']);
const formRef = ref(null);
const form = ref({
  name: '',
  image_url: '',
  file: null // Added to store the uploaded file
});
const rules = ref({
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    }
  ],
  file: [
    {
      required: true,
      message: '请上传图片',
      trigger: 'blur'
    }
  ]
});

const handleFileChange = (file, fileList) => {
  // Check if the file is valid
  if (file && file.raw instanceof File) {
    form.value.file = file.raw; // Store the file object
    console.log(file.raw);
    // Create a local URL for the uploaded file
    form.value.image_url = URL.createObjectURL(file.raw);
  } else {
    console.log(fileList);
    console.error('Invalid file object received:', file);
    ElMessage({
      message: '文件上传失败，请重新上传',
      type: 'error'
    });
  }
};
const handleClose = () => {
  emits('update:modelValue', false);
};

const handleConfirm = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const formData = new FormData();
      formData.append('name', form.value.name);
      formData.append('file', form.value.file);

      try {
        if (props.dialogTitle === '添加用户') {
          await addUser(formData); // Adjusted to send formData
        } else {
          await editUser(props.dialogTableValue.id, formData); // Added user ID to edit
        }
        emits('initUserList');
        ElMessage({
          message: '操作成功',
          type: 'success'
        });
        handleClose();
      } catch (error) {
        ElMessage({
          message: '操作失败',
          type: 'error'
        });
      }
    } else {
      ElMessage({
        message: '提交错误！',
        type: 'error'
      });
    }
  });
};

watch(
    () => props.dialogTableValue,
    newValue => {
      form.value = {
        name: newValue.name || '',
        image_url: newValue.image_url || '',
        file: null // Reset file on new value
      };
    },
    { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
</style>