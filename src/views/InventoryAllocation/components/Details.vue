<template>
  <el-container>
    <el-header>
      <h2 class="page-title">仓库及产品信息</h2>
    </el-header>

    <el-main>
      <!-- 查询表单 -->
      <el-form :model="queryParams" label-width="120px" class="query-form">
        <el-form-item label="仓库选择">
          <el-select v-model="queryParams.WarehouseID" placeholder="请选择仓库" class="select">
            <el-option v-for="warehouse in warehouses" :key="warehouse.WarehouseID" :label="warehouse.WarehouseName"
              :value="warehouse.WarehouseID" />
          </el-select>
        </el-form-item>

        <el-form-item label="开始日期">
          <el-date-picker v-model="queryParams.StartDate" type="date" placeholder="请选择开始日期" format="YYYY-MM-DD"
            class="date-picker" />
        </el-form-item>

        <el-form-item label="结束日期">
          <el-date-picker v-model="queryParams.EndDate" type="date" placeholder="请选择结束日期" format="YYYY-MM-DD"
            class="date-picker" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="filterData" class="query-btn">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- 仓库及产品信息表格 -->
      <el-table :data="filteredData" style="width: 100%" border :height="300" :scrolling="true" :virtual-scroll="true"
        :row-key="row => row.WarehouseID" class="styled-table">
        <el-table-column label="仓库名称" prop="WarehouseName" class="warehouse-column" />
        <el-table-column label="产品信息">
          <template #default="{ row }">
            <el-table :data="row.Products.filter(p => p.TotalQuantity > 0)" style="width: 100%" border
              class="product-table">
              <el-table-column label="产品名称" prop="ProductName" class="product-name-column"  sortable=true />
              <el-table-column label="总数量" prop="TotalQuantity" class="product-quantity-column" sortable=true />
            </el-table>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination :current-page="currentPage" :page-size="pageSize" :total="filteredData.length"
        @current-change="handlePageChange" class="pagination" />
    </el-main>
  </el-container>
</template>

<script setup>
import { queryDisbuteAPI } from '@/apis/warehouse/queryDisbute';
import { ref, computed, onMounted } from 'vue';

onMounted(async () => {
  const res = await queryDisbuteAPI(queryParams.value)
  warehouses.value = res.data
})


const warehouses = ref([]);

const queryParams = ref({
  WarehouseID: null,
  StartDate: null,
  EndDate: null
});

const currentPage = ref(1);
const pageSize = ref(5); // 每页显示的记录数

// 计算过滤后的数据
const filteredData = computed(() => {
  let result = [];
  // 如果指定了仓库ID，则过滤
  if (queryParams.value.WarehouseID) {
    result = warehouses.value.filter(warehouse => warehouse.WarehouseID === queryParams.value.WarehouseID);
  } else {
    result = [...warehouses.value];
  }
  return result;
});

// 分页处理
function handlePageChange(page) {
  currentPage.value = page;
  // console.log('当前页:', currentPage.value);
}

// 查询数据
function filterData() {
  // 这里可以添加其他数据过滤逻辑
  console.log('查询参数：', queryParams.value);
}
</script>

<style scoped>
.page-title {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-top: 20px;
}

.query-form {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f4f7fc;
  border-radius: 8px;
}

.query-form .el-form-item {
  margin-bottom: 10px;
}

.select,
.date-picker {
  width: 200px;
}

.query-btn {
  margin-top: 10px;
  background-color: #409EFF;
  color: white;
}

.styled-table .el-table {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 20px;
}

.warehouse-column {
  font-weight: bold;
  background-color: #f0f5ff;
}

.product-table {
  background-color: #fff;
  margin-top: 10px;
}

.product-name-column,
.product-quantity-column {
  text-align: center;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.el-table__cell {
  padding: 10px 20px;
}

.el-button {
  padding: 10px 20px;
}
</style>
