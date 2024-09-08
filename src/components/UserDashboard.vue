<template>
  <el-card>
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
            placeholder="请输入查询内容"
            clearable
            v-model="queryForm.query"
        ></el-input>
      </el-col>
      <el-button type="primary" @click="initGetUsersList">
        <Search class="small-icon"/> 搜索
      </el-button>
      <!-- 添加用户按钮仅在用户登录时显示 -->
      <el-button v-if="isAuthenticated" type="primary" @click="handleDialogValue()">添加用户</el-button>
      <el-button type="primary" class="home-button" @click="goToLogin">
        <House class="home-button" />返回登录
      </el-button>
    </el-row>


    <el-table :data="tableData" border stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          v-for="(item, index) in options"
          :key="index">
        <template v-slot="{ row }" v-if="item.prop === 'action'">
          <!-- 编辑和删除按钮仅在用户登录时显示 -->
          <el-button v-if="isAuthenticated" size="small" type="primary" @click="handleDialogValue(row)">
            <Edit class="small-icon2"/>
          </el-button>
          <el-button v-if="isAuthenticated" size="small" type="danger" @click="delUser(row)">
            <Delete class="small-icon2"/>
          </el-button>
        </template>
        <template v-slot="{ row }" v-else-if="item.prop === 'imageUrl'">
          <img @click="showLargeImage(row.imageUrl)" :src="'http://localhost:9090' + row.imageUrl" alt="User Image"
               style="max-width: 100px; max-height: 100px; cursor: pointer;"/>
        </template>
        <template v-slot="{ row }" v-else-if="item.prop === 'mg_state'">
          <el-switch v-model="row.mg_state" @change="changeState(row)" :disabled="!isAuthenticated"/>
        </template>
        <template v-slot="{ row }" v-else-if="item.prop === 'create_time'">
          {{ $filters.filterTimes(row.create_time) }}
        </template>
        <template v-slot="{ row }" v-else>
          {{ row[item.prop] }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:currentPage="queryForm.pagenum"
        :page-size="queryForm.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange">
    </el-pagination>
  </el-card>
  <Dialog
      v-model="dialogVisible"
      :dialogTitle="dialogTitle"
      :dialogTableValue="dialogTableValue"
      v-if="dialogVisible"
      @initUserList="initGetUsersList"
  />
  <transition name="fade">
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <img :src="largeImageUrl" alt="Large Image"
             style="width: auto; height: auto; max-width: 90vw; max-height: 90vh;">
      </div>
    </div>
  </transition>
</template>

<script setup>
import {Delete, Edit, Search} from '@element-plus/icons-vue';
import {computed, onMounted, ref} from 'vue'
import {deleteUser, getUsers} from '@/api/users'
import {options} from './options'
import {ElMessage, ElMessageBox} from 'element-plus'
import Dialog from './DialogView.vue'
import {isNull} from '@/utils/filters'
import router from "@/router";

const queryForm = ref({
  query: '',
  pagenum: 1,
  pagesize: 10
})
const tableData = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogTableValue = ref({})
const showModal = ref(false)
const largeImageUrl = ref('')

const goToLogin = () => {
  router.push('/login'); // Navigate to the login page
}

// 计算属性，判断用户是否已登录
const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token'); // 判断是否有 token 存在
})

const initGetUsersList = async () => {
  const res = await getUsers(queryForm.value);
  total.value = res.totalElements; // Use totalElements for the total count
  tableData.value = res.content; // Correctly set tableData from res.content
}

onMounted(initGetUsersList)

const handleCurrentChange = (pageNum) => {
  queryForm.value.pagenum = pageNum
  initGetUsersList()
}

const handleDialogValue = (info) => {
  if (isNull(info)) {
    dialogTitle.value = '添加用户'
    dialogTableValue.value = {}
  } else {
    dialogTitle.value = '编辑用户'
    dialogTableValue.value = JSON.parse(JSON.stringify(info))
  }
  dialogVisible.value = true
}

const delUser = (info) => {
  ElMessageBox.confirm('确定要删除此用户吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(async () => {
        await deleteUser(info.id)
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        initGetUsersList()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '删除失败'
        })
      })
}

const showLargeImage = (imageUrl) => {
  showModal.value = true;
  largeImageUrl.value = `http://localhost:9090${imageUrl}`;
}
</script>

<style lang="scss" scoped>
.small-icon {
  width: 16px; /* 设置图标宽度 */
  height: 16px; /* 设置图标高度 */
}

.small-icon2 {
  width: 13px; /* 设置图标宽度 */
  height: 13px; /* 设置图标高度 */
}

.home-button {
  position: absolute; /* Use absolute positioning */
  right: 13px; /* Adjust as necessary */
}

.header {
  padding-bottom: 16px;
  box-sizing: border-box;
}

::v-deep .el-input__suffix {
  align-items: center;
}

::v-deep .el-pagination {
  padding-top: 16px;
  box-sizing: border-box;
  text-align: right;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 确保遮罩层覆盖所有元素 */
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1001; /* 确保内容层覆盖遮罩层 */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>