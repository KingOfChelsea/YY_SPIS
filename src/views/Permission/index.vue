<template>
  <el-container>
    <el-header>
      <h2 class="title">权限管理</h2>

    </el-header>

    <el-main>
      <el-card >
       <el-button type="primary" @click="showAddDialog">添加权限</el-button>
        <!-- 添加滚动条 -->
        <el-scrollbar max-height="600px">
          <el-table :data="permissions" row-key="PermissionID" border stripe>
            <!-- 展开按钮 -->
            <el-table-column type="expand">
              <template #default="{ row }">
                <el-scrollbar max-height="300px">
                  <el-table v-if="row.SubPermissions.length > 0" :data="row.SubPermissions" border stripe>
                    <el-table-column label="子权限名称" prop="PermissionName" min-width="200" />
                    <el-table-column label="路径" prop="Path" min-width="200" />
                    <el-table-column label="状态" prop="IsEnabled" width="100">
                      <template #default="{ row }">
                        <el-tag :type="row.IsEnabled ? 'success' : 'danger'">
                          {{ row.IsEnabled ? "启用" : "禁用" }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                      <template #default="{ row }">
                        <el-button type="primary" size="small" @click="editPermission(row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="confirmDelete(row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-scrollbar>
              </template>
            </el-table-column>

            <!-- 权限母ID -->
             <el-table-column label="权限标识" prop="PermissionID" min-width="100">

             </el-table-column>
            <!-- 权限名称 -->
            <el-table-column label="权限名称" prop="PermissionName" min-width="200">
              <template #default="{ row }">
                <el-icon><component :is="row.Icon" /></el-icon>
                <span class="permission-name">{{ row.PermissionName }}</span>
              </template>
            </el-table-column>

            <!-- 路径 -->
            <el-table-column label="路径" prop="Path" min-width="200" />

            <!-- 状态 -->
            <el-table-column label="状态" prop="IsEnabled" width="100">
              <template #default="{ row }">
                <el-tag :type="row.IsEnabled ? 'success' : 'danger'">
                  {{ row.IsEnabled ? "启用" : "禁用" }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- 创建时间 -->
            <el-table-column label="创建时间" prop="CreatedAt" width="180" :formatter="formatDate" />

            <!-- 操作 -->
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="editPermission(row)">编辑</el-button>
                <el-button type="danger" size="small" @click="confirmDelete(row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-scrollbar>
      </el-card>
    </el-main>


  <!-- 添加/编辑权限弹窗 -->
  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑权限' : '添加权限'" width="700px">
    <el-form :model="formData" label-width="120px">
      <!-- 显示父级节点  -->
      <el-divider  content-position="left">父节点</el-divider>
      <!-- 权限名称 -->
      <el-form-item label="权限名称" required>
        <el-input v-model="formData.PermissionName" />
      </el-form-item>

      <!-- 路径 -->
      <el-form-item label="路径" required>
        <el-input v-model="formData.Path" />
      </el-form-item>

      <!-- 状态 -->
      <el-form-item label="状态">
        <el-switch v-model="formData.IsEnabled" />
      </el-form-item>

      <!-- 子权限表格 -->
      <el-divider content-position="left">子权限</el-divider>

      <el-table :data="formData.SubPermissions" border stripe>
        <el-table-column label="名称" prop="PermissionName" min-width="200">
          <template #default="{ row }">
            <el-input v-model="row.PermissionName" placeholder="输入子权限名称" />
          </template>
        </el-table-column>

        <el-table-column label="路径" prop="Path" min-width="200">
          <template #default="{ row }">
            <el-input v-model="row.Path" placeholder="输入路径" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="danger" size="small" @click="confirmDelete(scope.$index)" v-if="formData.SubPermissions.length > 1">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-button type="success" @click="addSubPermission" style="margin-top: 10px;">添加子权限</el-button>

    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确认</el-button>
    </template>

  </el-dialog>

  </el-container>
</template>



<script setup>
import { getPermissionAPI } from "@/apis/permission/getPermisson";
import { showNotification } from "@/utils/Ealert";
import { clearFormData } from "@/utils/tools";
import { ref, onMounted } from "vue";

// **权限数据**
const permissions = ref([]);

// **对话框控制**
const dialogVisible = ref(false);
const isEdit = ref(false);

// **表单数据**
const formData = ref({
  PermissionName: "",
  Path: "",
  IsEnabled: true,
  SubPermissions: [{ PermissionName: "", Path: "" }]
});



// **加载权限数据**
onMounted(() => {
  fetchPermissions();
});

/** 获取权限接口数据 Created By Zane Xu 2025-3-14  */
const fetchPermissions = async () => {
  try {
    const res = await getPermissionAPI()
    permissions.value = res.data
    showNotification("success","数据获取成功！")
  } catch (error) {
    showNotification("error",error)
  }
};

/** 显示添加权限弹窗 Created By Zane Xu 2025-3-14 */
const showAddDialog = () => {
  // 清空数据
  clearFormData(formData.value)
  isEdit.value = false;
  dialogVisible.value = true;
};

// **编辑权限**
const editPermission = (row) => {
  formData.value = { ...row };
  isEdit.value = true;
  dialogVisible.value = true;
};

// **提交表单**
const submitForm = () => {
  if (!formData.value.PermissionName || !formData.value.Path) {
    ElMessage.error("请填写完整信息");
    return;
  }
  if (isEdit.value) {
    // 编辑逻辑
    const index = permissions.value.findIndex(p => p.PermissionID === formData.value.PermissionID);
    if (index !== -1) {
      permissions.value[index] = { ...formData.value };
    }
    ElMessage.success("权限修改成功");
  } else {
    // 新增逻辑
    formData.value.PermissionID = permissions.value.length + 1;
    permissions.value.push({ ...formData.value });
    ElMessage.success("权限添加成功");
  }

  dialogVisible.value = false;
};

// **确认删除**
const confirmDelete = (row) => {
  ElMessageBox.confirm(`确定删除权限 "${row.PermissionName}" 吗？`, "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    // deletePermission(row);
    console.log(row);

  });
};


// 删除子权限（保留至少1个）
const removeSubPermission = (index) => {
  if (formData.value.SubPermissions.length > 1) {
    formData.value.SubPermissions.splice(index, 1);
  }
};

// 添加子权限(dialog种)
const addSubPermission = () => {
  formData.value.SubPermissions.push({ PermissionName: "", Path: "" });
};



// **格式化时间**
const formatDate = (row, column, cellValue) => {
  return cellValue ? cellValue.split("T")[0] : "";
};

</script>


<style scoped>
.sub-permission-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
</style>
