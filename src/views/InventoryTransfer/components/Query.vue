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
                  <el-option v-for="warehouse in warehouses" :key="warehouse.id" :label="warehouse.name" :value="warehouse.id" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="目标仓库">
                <el-select v-model="queryParams.ToWarehouseID" placeholder="选择目标仓库" clearable>
                  <el-option v-for="warehouse in warehouses" :key="warehouse.id" :label="warehouse.name" :value="warehouse.id" />
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
                <el-date-picker v-model="queryParams.DateRange" type="daterange" format="YYYY-MM-DD" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable />
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
      <el-card shadow="hover" class="table-card">
        <el-table :data="filteredData" highlight-current-row border stripe style="width:100%; overflow-y: auto; height: 300px;">
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
        <el-pagination :current-page="currentPage" :page-size="pageSize" :total="filteredData.length" @current-change="handlePageChange" layout="prev, pager, next, total" class="pagination" />
      </el-card>
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
        <el-button type="primary" @click="statusDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

  </el-container>
</template>

<script setup>
import { fetchTransferAPI } from "@/apis/warehouse/fetchTransfer";
import { ref, computed,onMounted} from "vue";

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
  return { Pending: 1, "In Progress": 2, Approved: 3, Completed: 4 }[status] || 0;
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

// **初始化数据**
onMounted(async () => {
  // const res = await fetchTransferAPI();
  // transferRecords.value = res.data;

  // 模拟仓库和产品数据
  warehouses.value = [
    { id: 1, name: "祈福缤纷世界(Ozon特货仓库)" },
    { id: 2, name: "广州商学院（总部仓库）" },
    { id: 3, name: "华东仓库" },
  ];
  products.value = [
    { id: 3, name: "汾酒牛筋丸" },
    { id: 4, name: "汾酒牛肉丸" },
    { id: 5, name: "青花汾酒" },
  ];
});
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

