<template>
  <el-container class="order-query-container">
    <el-header>
      <h2 class="order-title">📋 订单查询</h2>
    </el-header>

    <el-main>
      <!-- 查询表单 -->
      <el-card shadow="hover" class="query-card">
        <el-form :model="queryParams" label-width="120px" class="query-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="买家姓名">
                <el-input v-model="queryParams.CustomerName" placeholder="输入买家姓名" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="订单状态">
                <el-select v-model="queryParams.Status" placeholder="选择状态" clearable>
                  <el-option label="Pending" value="Pending" />
                  <el-option label="Shipped" value="Shipped" />
                  <el-option label="Completed" value="Completed" />
                  <el-option label="Cancelled" value="Cancelled" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="订单金额范围">
                <el-input-number v-model="queryParams.MinTotalAmount" :min="0" placeholder="最小金额" style="width: 45%;" />
                ——
                <el-input-number v-model="queryParams.MaxTotalAmount" :min="0" placeholder="最大金额" style="width: 45%;" />
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="订单时间范围">
                <el-date-picker v-model="queryParams.OrderDateRange" type="daterange" format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item>
                <el-button type="primary" @click="fetchOrders" >查询</el-button>
                <el-button @click="resetQuery" >重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 订单列表 -->
      <el-card shadow="hover" class="table-card">
        <el-table :data="filteredOrders" border stripe row-key="OrderID" @expand-change="handleExpand" default-expand-all>
          <el-table-column type="expand">
            <template #default="{ row }">
              <el-table :data="row.OrderDetails" border stripe>
                <el-table-column prop="DetailID" label="明细ID" width="100" />
                <el-table-column prop="ProductName" label="商品名称" min-width="180" />
                <el-table-column prop="Quantity" label="数量" width="100" align="center" />
                <el-table-column prop="Price" label="单价" width="150" align="center" />
                <el-table-column prop="SubTotal" label="小计" width="150" align="center" />
              </el-table>
            </template>
          </el-table-column>

          <el-table-column prop="OrderID" label="订单ID" width="100" />
          <el-table-column prop="CustomerName" label="买家姓名" min-width="150" />
          <el-table-column prop="OrderDate" label="订单时间" min-width="180" />
          <el-table-column prop="TotalAmount" label="订单总金额" width="150" align="center" />
          <el-table-column prop="Status" label="订单状态" width="150">
            <template #default="{ row }">
              <el-tag :type="getStatusTag(row.Status)" class="status-tag">{{ row.Status }}</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination :current-page="currentPage" :page-size="pageSize" :total="filteredOrders.length" @current-change="handlePageChange" layout="prev, pager, next, total" class="pagination" />
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { fetchQuatationAPI } from "@/apis/sales/fetchQuotation";
import { ElMessage } from "element-plus";
import { ref, computed } from "vue";

// 查询参数
const queryParams = ref({
  CustomerID: "",
  CustomerName: "",
  Status: "",
  MinTotalAmount: 10,
  MaxTotalAmount: 11000,
  OrderDateRange: ["", ""]
});

// 订单数据（模拟）
const orders = ref([]);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);

// 计算过滤后的订单数据
const filteredOrders = computed(() => {
  return orders.value
    .filter(order =>
      (!queryParams.value.CustomerName || order.CustomerName.includes(queryParams.value.CustomerName)) &&
      (!queryParams.value.Status || order.Status === queryParams.value.Status) &&
      (!queryParams.value.MinTotalAmount || order.TotalAmount >= queryParams.value.MinTotalAmount) &&
      (!queryParams.value.MaxTotalAmount || order.TotalAmount <= queryParams.value.MaxTotalAmount)
    )
    .slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

// 获取订单状态颜色
const getStatusTag = (status) => {
  return status === "Pending" ? "warning" : status === "Shipped" ? "primary" : status === "Completed" ? "success" : "danger";
};

//** 查询订单 Created By Zane Xu 2025-3-18 */
const fetchOrders = async() => {
  try {
    const res = await fetchQuatationAPI(queryParams.value)
    if (res.success) {
      orders.value = res.data
      ElMessage.success("数据查询成功！")
    }else{
      ElMessage.warning(res.message)
    }
  } catch (error) {
    ElMessage.error("error:",error)
  }
};

// 重置查询
const resetQuery = () => {
  queryParams.value = { CustomerID: "", CustomerName: "", Status: "", MinTotalAmount: 0, MaxTotalAmount: 1000, OrderDateRange: ["", ""] };
  // fetchOrders();
};

// 处理分页变更
const handlePageChange = (page) => {
  currentPage.value = page;
};

// 处理展开行
const handleExpand = (row, expanded) => {
  if (expanded) {
    console.log("展开订单详情:", row.OrderDetails);
  }
};
</script>

<style scoped>
.order-query-container {
  padding: 20px;
}

/* 标题 */
.order-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

/* 选项卡 */
.el-tabs {
  margin-top: 10px;
}

/* 查询表单 */
.query-card {
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

/* 表格 */
.table-card {
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

/* 分页 */
.pagination {
  margin-top: 20px;
  text-align: center;
}

/* 状态标签 */
.status-tag {
  font-size: 12px;
}
</style>
