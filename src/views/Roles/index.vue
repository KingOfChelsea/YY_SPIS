<template>
  <el-container>
    <el-header class="header1">
      <h2 class="title">🔑 角色权限管理</h2>
    </el-header>

    <el-main class="main-container">
      <el-row :gutter="20">
        <!-- 角色选择 -->
        <el-col :span="6">
          <el-card shadow="hover" class="role-card">
            <h3>选择角色</h3>
            <el-select v-model="selectedRole" placeholder="请选择角色" @change="handleRoleChange" class="full-width">
              <el-option v-for="role in roles" :key="role.RoleID" :label="role.RoleName" :value="role.RoleID" />
            </el-select>
          </el-card>
        </el-col>

        <!-- 权限管理 -->
        <el-col :span="18">
          <el-card shadow="hover" class="permission-card">
            <h3>权限管理</h3>
            <el-divider />

            <!-- 滚动容器 -->
            <el-scrollbar class="scroll-container">
              <el-tree ref="treeRef" :data="treePermissions" show-checkbox node-key="PermissionID" default-expand-all
                :props="{ label: 'PermissionName', children: 'SubPermissions' }" @check-change="handleCheckChange" />
            </el-scrollbar>

            <el-divider />

            <!-- 已选权限 -->
            <h3>已选权限</h3>
            <el-scrollbar class="selected-permissions">
              <el-tag v-for="perm in selectedPermissions" :key="perm.PermissionID" type="success"
                @close="removePermission(perm.PermissionID)" class="tag-style">
                {{ perm.PermissionName }}
              </el-tag>
            </el-scrollbar>
          </el-card>
        </el-col>
      </el-row>

      <!-- 固定提交按钮 -->
      <div class="submit-container">
        <el-button type="primary" @click="submitPermissions">提交权限</el-button>
      </div>
    </el-main>
  </el-container>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { getRoleDataAPI } from "@/apis/roles/getRoles";
import { getPermissionAPI } from "@/apis/permission/getPermisson";
import { showNotification } from "@/utils/Ealert";
import { assignRoleAPI } from "@/apis/permission/assignRoles";


// ** tree标识 **
const treeRef = ref(null);

// **角色数据**
const roles = ref([]);
// **原始权限数据**
const treePermissions = ref([]);

// **选中的角色**
const selectedRole = ref(null);

// **已选权限**
const selectedPermissions = ref([]);

// **角色切换**
const handleRoleChange = () => {
  ElMessage.success(`已选择角色：${roles.value.find((r) => r.RoleID === selectedRole.value).RoleName}`);
};

/**处理选中权限 Created By Zane Xu 2025-3-17 */
const handleCheckChange = (node, checked, indeterminate) => {
  // console.log(node, checked, indeterminate);
  if (indeterminate == true) {
    treeRef.value.setChecked(node.PermissionID, true)
  } else {
    if (checked) {
      addPermission(node);
    } else {
      removePermission(node.PermissionID);
    }
  }

};

// **添加权限**
const addPermission = (node) => {
  if (!selectedPermissions.value.some((p) => p.PermissionID === node.PermissionID)) {
    selectedPermissions.value.push(node);
  }
};

// **移除权限**
const removePermission = (permissionID) => {
  selectedPermissions.value = selectedPermissions.value.filter((p) => p.PermissionID !== permissionID);
};

// **提交权限**
const submitPermissions = async () => {
  if (!selectedRole.value) return ElMessage.error("请选择角色");
  if (!selectedPermissions.value.length) return ElMessage.error("请选择权限");
  // 获取所有选中的 PermissionID
  const permissionIDs = selectedPermissions.value.map((p) => p.PermissionID);

  // console.log("提交数据", {
  //   RoleID: selectedRole.value,
  //   Permissions: permissionIDs
  // });
  try {
    const res = await assignRoleAPI({
      RoleID: selectedRole.value,
      PermissionIDs: permissionIDs
    })
    ElMessage.success("权限分配成功");
    
  } catch (error) {

  }

  console.log(res.message);


};
/** 获取接口数据 Created By Zane Xu 2025-03-14 */
onMounted(async () => {
  try {
    const res = await getRoleDataAPI()
    const permission_res = await getPermissionAPI()
    roles.value = res.data
    treePermissions.value = permission_res.data
  } catch (error) {
    showNotification("error", error)
  }
})
</script>

<style scoped>
/* 标题居中 */
.header1 {
  text-align: center;
  padding: 10px;
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

/* 主要内容区域 */
.main-container {
  padding: 20px;
}

/* 角色选择 */
.role-card {
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 权限管理卡片 */
.permission-card {
  height: 600px;
  display: flex;
  flex-direction: column;
}

/* 让权限树滚动 */
.scroll-container {
  max-height: 300px;
  overflow-y: auto;
}

/* 已选权限滚动 */
.selected-permissions {
  max-height: 120px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
}

/* 选中的权限标签 */
.tag-style {
  margin: 5px;
}

/* 固定底部按钮 */
.submit-container {
  text-align: center;
  margin-top: 20px;
}
</style>
