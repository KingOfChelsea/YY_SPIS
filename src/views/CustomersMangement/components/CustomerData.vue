<template>
  <!-- 🔹 查询表单 -->
  <el-card shadow="hover" class="search-card">
    <el-form :model="searchQuery" label-width="100px">
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item label="买家姓名">
            <el-input v-model="searchQuery.CustomerName" placeholder="请输入姓名" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="联系方式">
            <el-input v-model="searchQuery.ContactNumber" placeholder="请输入手机号" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="电子邮件">
            <el-input v-model="searchQuery.Email" placeholder="请输入邮箱" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="日期选择">
            <el-date-picker v-model="searchQuery.DateRange" type="datetimerange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期"  clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="地址">
            <el-input placeholder="请输入地址" v-model="searchQuery.Address" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="filterCustomers">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>

  <!-- 买家信息表格 -->
  <el-card shadow="hover" class="table-card">
    <el-table :data="customers" border stripe highlight-current-row @row-click="handleRowClick">
      <el-table-column prop="CustomerID" label="ID" width="80" />
      <el-table-column prop="CustomerName" label="买家姓名" width="150" />
      <el-table-column prop="ContactNumber" label="联系方式" width="150" />
      <el-table-column prop="Email" label="电子邮件" min-width="180" />
      <el-table-column prop="Address" label="买家地址" min-width="250" />
      <el-table-column prop="CreatedAt" label="创建时间" width="180" />
      <el-table-column label="操作" min-width="120">
        <template #default="{ row }">
          <div style="display: flex;justify-content: center;">
            <el-button type="primary" size="small" @click.stop="handleRowClick(row)">查看</el-button>
            <el-button type="danger" size="small" @click.stop="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 分页 -->
  <el-pagination :current-page="currentPage" :page-size="pageSize" :total="customers.length"
    @current-change="handlePageChange" layout="prev, pager, next, total" class="pagination" />

  <!-- 客户详情弹窗 -->
  <el-dialog v-model="dialogVisible" title="客户详情" width="500px" class="custom-dialog">
    <div class="dialog-header">
      <el-avatar :size="80"
        src="https://raw.githubusercontent.com/KingOfChelsea/MarkdownPicGo/main/202411211121303.png" />
      <div class="customer-name">{{ selectedCustomer.CustomerName }}</div>
    </div>

    <el-divider />

    <el-form :model="selectedCustomer" label-width="100px" class="custom-form">
      <el-form-item label="用户身份">
        <el-input v-model="selectedCustomer.CustomerID" readonly></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="selectedCustomer.ContactNumber" :readonly="!isEditing" class="highlight-input phone" />
      </el-form-item>
      <el-form-item label="电子邮件">
        <el-input v-model="selectedCustomer.Email" :readonly="!isEditing" class="highlight-input email" />
      </el-form-item>
      <el-form-item label="买家地址">
        <el-input v-model="selectedCustomer.Address" type="textarea" :readonly="!isEditing" class="highlight-input" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="selectedCustomer.CreatedAt" readonly class="highlight-input time" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button v-if="!isEditing" @click="enableEdit" type="warning">
        <el-icon>
          <Unlock />
        </el-icon> 启用编辑
      </el-button>
      <el-button v-if="isEditing" @click="saveChanges" type="success">
        <el-icon>
          <Lock />
        </el-icon> 保存修改
      </el-button>
      <el-button @click="closeDialog" class="close-btn">关闭</el-button>
    </template>
  </el-dialog>

</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { fetchCustomersAPI } from "@/apis/sales/fetchCustomers"; // 获取客户数据
import { deleteCustomersAPI } from "@/apis/sales/deleteCustomers";
import { Unlock, Lock } from '@element-plus/icons-vue'
import { updateCustomerAPI } from "@/apis/sales/updateCustomer";
import { SearchCustomersAPI } from "@/apis/sales/searchCustomer";
import { ElMessage } from "element-plus";

// **查询条件**
const searchQuery = ref({
  // CustomerName: "",
  ContactNumber: "",
  Email: "",
  Address:"",
  DateRange:[],
});

// **启用编辑**
const Edit = ref({
  IsEdit: true,
  IsIcon: Lock,
  type: "success",
})

// **客户数据**
const customers = ref([]);

// 筛选后的客户数据
// const filteredCustomers = computed(() => {
//   return customers.value.filter(customer => {
//     return (
//       (!searchQuery.value.CustomerName || customer.CustomerName.includes(searchQuery.value.CustomerName)) &&
//       (!searchQuery.value.ContactNumber || customer.ContactNumber.includes(searchQuery.value.ContactNumber)) &&
//       (!searchQuery.value.Email || customer.Email.includes(searchQuery.value.Email))
//     );
//   }).slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
// });




// **分页参数**

const currentPage = ref(1);
const pageSize = ref(10);

// **计算分页数据**
const paginatedCustomers = computed(() => {
  return customers.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

// **弹窗控制**
const dialogVisible = ref(false);
const isEditing = ref(false);

const selectedCustomer = ref({});

// **处理行点击（弹出详情）**
const handleRowClick = (row) => {
  selectedCustomer.value = { ...row };
  dialogVisible.value = true;
};

// **分页变更**
const handlePageChange = (page) => {
  currentPage.value = page;
};

// **查询功能**
const filterCustomers = async() => {
  try {
    const res = await SearchCustomersAPI(searchQuery.value)
    console.log(res);
    if (res.success) {
      customers.value = res.data
      ElMessage.success("查询成功数据覆盖中...")
    }
  } catch (error) {
    ElMessage.error("信息错误",error)
  }
  currentPage.value = 1;
};

// **重置搜索**
const resetSearch = () => {
  searchQuery.value = { CustomerName: "", ContactNumber: "", Email: "" };
  filterCustomers();
};

// **获取客户数据**
const fetchCustomers = async () => {
  try {
    const res = await fetchCustomersAPI();
    customers.value = res.data;
    ElMessage.success("客户数据加载成功!");
  } catch (error) {
    ElMessage.error("获取客户数据失败", error);
  }
};

// **删除客户**
const handleDelete = (row) => {
  ElMessage.confirm(
    `确定要删除客户 "${row.CustomerName}" 吗？`,
    "删除确认",
    {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      // **执行删除**
      const res = await deleteCustomersAPI(row.CustomerID)
      if (res.success) {
        customers.value = customers.value.filter(c => c.CustomerID !== row.CustomerID);
        // **如果当前页数据被删光了，跳转到上一页**
        if (filteredCustomers.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
        }
        ElMessage.success(row.CustomerName + "个人信息已经删除" + res.message);
      } else {
        ElMessage.error("出现问题", res.message)
      }
    })
    .catch((error) => {
      ElMessage.info("已取消删除", error);
    });
};

// **启用编辑**
const enableEdit = () => {
  isEditing.value = true;
};

// **保存修改**
const saveChanges = async () => {
  try {
    const res = await updateCustomerAPI(selectedCustomer.value.CustomerID, selectedCustomer.value);
    if (res.success) {
      ElMessage.success("修改成功！");
      closeDialog()
      fetchCustomers();
    } else {
      ElMessage.error(res.message);
    }
  } catch (error) {
    ElMessage.error("修改失败：" + error.message);
  }
};

// **关闭弹窗**
const closeDialog = () => {
  isEditing.value = false;
  dialogVisible.value = false;
};



// **初始化数据**
onMounted(fetchCustomers);
</script>

<style scoped>
.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

/* 弹窗整体 */
.custom-dialog {
  border-radius: 10px;
}

/* 顶部客户信息 */
.dialog-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;
  text-align: center;
}

/* 客户姓名 */
.customer-name {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}

/* 表单优化 */
.custom-form {
  padding: 10px 20px;
}

/* 高亮输入框 */
.highlight-input {
  font-weight: bold;
  background-color: #f7f9fc;
  border-radius: 6px;
}

/* 颜色区分 */
.phone {
  color: #27ae60;
}

/* 联系方式 绿色 */
.email {
  color: #2980b9;
}

/* 邮箱 蓝色 */
.time {
  color: #8e44ad;
}

/* 时间 紫色 */

/* 关闭按钮 */
.close-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  font-weight: bold;
}

.close-btn:hover {
  background-color: #c0392b;
}
</style>
