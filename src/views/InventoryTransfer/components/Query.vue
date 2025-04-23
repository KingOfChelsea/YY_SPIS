<template>
  <el-container>
    <el-header>
      <h2 class="title">📝调拨记录查询</h2>
    </el-header>

    <el-main>
      <!-- 查询表单 -->
      <el-card shadow="hover" class="search-card">
        <el-form :model="queryParams" label-width="120px" class="search-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="调拨记录 ID">
                <el-input v-model="queryParams.TransferID" placeholder="输入调拨 ID" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="产品">
                <el-select v-model="queryParams.ProductID" placeholder="请选择产品" clearable>
                  <el-option v-for="product in products" :key="product.id" :label="product.name" :value="product.id" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="来源仓库">
                <el-select v-model="queryParams.FromWarehouseID" placeholder="选择来源仓库" clearable>
                  <el-option v-for="warehouse in warehouses" :key="warehouse.id" :label="warehouse.name"
                    :value="warehouse.id" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="目标仓库">
                <el-select v-model="queryParams.ToWarehouseID" placeholder="选择目标仓库" clearable>
                  <el-option v-for="warehouse in warehouses" :key="warehouse.id" :label="warehouse.name"
                    :value="warehouse.id" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="状态">
                <el-select v-model="queryParams.Status" placeholder="选择状态" clearable>
                  <el-option label="Pending" value="Pending" />
                  <el-option label="In Progress" value="In Progress" />
                  <el-option label="Approved" value="Approved" />
                  <el-option label="Completed" value="Completed" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="时间范围">
                <el-date-picker v-model="queryParams.DateRange" type="daterange" format="YYYY-MM-DD" range-separator="至"
                  start-placeholder="开始日期" end-placeholder="结束日期" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" @click="fetchTransferRecords">查询</el-button>
                <el-button @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 表格数据 -->
      <div v-if="filteredData.length > 0">
        <el-card shadow="hover" class="table-card">
          <el-table :data="filteredData" highlight-current-row border stripe
            style="width:100%; overflow-y: auto; height: 300px;">
            <el-table-column sortable="true" label="调拨 ID" prop="TransferID" width="100" />
            <el-table-column label="产品名称" prop="ProductName" width="150" />
            <el-table-column label="来源仓库" prop="FromWarehouseName" min-width="180" />
            <el-table-column label="目标仓库" prop="ToWarehouseName" min-width="180" />
            <el-table-column label="调拨数量" prop="Quantity" width="100" align="center" />
            <el-table-column label="调拨时间" prop="TransferDate" width="180" />

            <!-- 可点击的状态 -->
            <el-table-column label="状态" prop="Status" width="120">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.Status)" @click="openStatusDialog(row)" class="clickable-status">
                  {{ row.Status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination :current-page="currentPage" :page-size="pageSize" :total="filteredData.length"
            @current-change="handlePageChange" layout="prev, pager, next, total" class="pagination" />
        </el-card>
      </div>
      <div v-else class="no-order">
        <el-empty description="未找到订单信息" />
      </div>


    </el-main>

    <!-- 🔹 状态进度弹窗 -->
    <el-dialog v-model="statusDialogVisible" title="📌 调拨进度" width="600px">
      <el-steps :active="getStepIndex(currentRow?.Status)" align-center finish-status="success">
        <el-step title="待处理 (Pending)" />
        <el-step title="处理中 (In Progress)" />
        <el-step title="已批准 (Approved)" />
        <el-step title="已完成 (Completed)" />
      </el-steps>
      <div class="status-detail">
        <p><strong>调拨 ID：</strong>{{ currentRow?.TransferID }}</p>
        <p><strong>产品：</strong>{{ currentRow?.ProductName }}</p>
        <p><strong>来源仓库：</strong>{{ currentRow?.FromWarehouseName }}</p>
        <p><strong>目标仓库：</strong>{{ currentRow?.ToWarehouseName }}</p>
        <p><strong>调拨数量：</strong>{{ currentRow?.Quantity }}</p>
        <p><strong>调拨时间：</strong>{{ currentRow?.TransferDate }}</p>
      </div>
      <template #footer>
        <el-button type="primary" :disabled="!canApprove(currentRow?.Status, userRoleId)"
          @click="btnConsent(currentRow?.TransferID, getConsentType(currentRow?.Status, userRoleId),currentRow?.Status)">
          {{ getConsentType(currentRow?.Status, userRoleId) }}
        </el-button>
        <el-button type="danger" @click="statusDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

  </el-container>
</template>

<script setup>
import { approveTransferLogAPI } from "@/apis/warehouse/approveTransfer";
import { changeStatusTransferAPI } from "@/apis/warehouse/changeStatusTransfer";
import { fetchTransferAPI } from "@/apis/warehouse/fetchTransfer";
import { useUserStore } from "@/stores/Roles/roles";
import { showNotification } from "@/utils/Ealert";
import { ref, computed } from "vue";
const userStore = useUserStore();
// **仓库 & 产品数据**
const warehouses = ref([]);
const products = ref([]);

// **查询参数**
const queryParams = ref({
  TransferID: null,
  ProductID: null,
  FromWarehouseID: null,
  ToWarehouseID: null,
  Status: null,
  DateRange: null,
});

// **表格数据**
const transferRecords = ref([]);

// **当前点击的行数据**
const statusDialogVisible = ref(false);
const currentRow = ref(null);

// **分页控制**
const currentPage = ref(1);
const pageSize = ref(10);

// **计算分页数据**
const filteredData = computed(() => transferRecords.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value));

// **状态颜色**
const getStatusType = (status) => {
  return { Pending: "warning", "In Progress": "info", Approved: "primary", Completed: "success" }[status] || "default";
};

// **获取当前状态步骤索引**
const getStepIndex = (status) => {
  return { "Pending": 1, "In Progress": 2, "Approved": 3, "Completed": 4 }[status] || 0;
};

// **打开状态弹窗**
const openStatusDialog = (row) => {
  currentRow.value = row;
  statusDialogVisible.value = true;
};

// **分页事件**
const handlePageChange = (page) => {
  currentPage.value = page;
};

// **获取调拨记录**
const fetchTransferRecords = async () => {
  try {
    const res = await fetchTransferAPI(queryParams.value);
    transferRecords.value = res.data;
    ElMessage.success("查询成功");
  } catch (error) {
    ElMessage.error("获取数据失败");
  }
};

// **重置查询条件**
const resetQuery = () => {
  queryParams.value = { TransferID: null, ProductID: null, FromWarehouseID: null, ToWarehouseID: null, Status: null, DateRange: null };
  // fetchTransferRecords();
};

//btnConcent按钮,样式权限控制
const userRoleId = ref(userStore.userInfo.Position); // 示例：经理角色
// 定义角色ID与审批级别的映射
const rolePermissionMap = {
  1: [1],    // 角色ID 1 可以审批主管级别
  2: [1, 2], // 角色ID 2 可以审批主管和经理级别
  3: [1, 2, 3] // 角色ID 3 可以审批所有级别
}

// 定义审批级别文本
const consentTypeText = {
  1: "主管审批",
  2: "经理审批",
  3: "总经理审批"
}
const getConsentType = (status, userRoleId) => {
  const num = getStepIndex(status);
  const canApprove = rolePermissionMap[userRoleId]?.includes(num);
  return canApprove ? consentTypeText[num] || "审批" : "禁止";
}

const canApprove = (status, userRoleId) => {
  const num = getStepIndex(status);
  return rolePermissionMap[userRoleId]?.includes(num);
}
const btnConsent = async (TransferID, Name,Status) => {
  console.log(TransferID, Name);
  if (Name == "总经理审批") {
    try {
    const res = await approveTransferLogAPI({"TransferID":TransferID})
      if (res.success) {
        showNotification("success",res.message)
        statusDialogVisible.value =false;
        return
      }
      showNotification("warning",res.message)
    } catch (error) {
        showNotification("error:",error)
    }
  }else{
    //更改状态接口
    const res = await changeStatusTransferAPI({
      "TransferID":TransferID,
      "Status":Status,
    })
    showNotification("success",res.message)
    statusDialogVisible.value =false;
  }

}

</script>

<style scoped>
.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.table-card {
  margin-top: 20px;
}

/* 状态列可点击 */
.clickable-status {
  cursor: pointer;
}

.clickable-status:hover {
  opacity: 0.8;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.status-detail {
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.6;
}
</style>
