<template>
  <div class="container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-row :span="24">
          <el-col :span="8">
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称">
              <el-input v-model="searchForm.supplierName" placeholder="请输入供应商名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人">
              <el-input v-model="searchForm.employeeName" placeholder="请输入创建人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="创建时间">
              <el-date-picker v-model="searchForm.createdAt" type="daterange" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 140px;">
                <el-option label="已审核" value="已审核" />
                <el-option label="待审核" value="待审核" />
                <el-option label="草稿 " value="草稿" />
                <el-option label="已取消" value="已取消" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="btn-group">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="warning" @click="">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table table-layout="fixed"  :data="purchaseOrders" style="width: 100%; "border>
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-table :data="row.Details" border>
              <el-table-column prop="ProductName" label="产品名称" min-width="180"  sortable />
              <el-table-column prop="Quantity" label="采购数量" width="120" sortable  />
              <el-table-column prop="SubTotal" label="小计（元）" width="150"  sortable />
            </el-table>
          </template>
        </el-table-column>

        <el-table-column prop="PurchaseOrderID" label="采购单ID" width="120" sortable  />
        <el-table-column prop="CreatedAt" label="创建时间" width="180" sortable />
        <el-table-column prop="SupplierName" label="供应商" min-width="180"sortable  />
        <el-table-column prop="EmployeeName" label="创建人" width="120" sortable />
        <el-table-column prop="Status" label="状态" width="120" sortable >
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.Status)">{{ row.Status }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="280" sortable>
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewDetails(row)">查看详情</el-button>
            <el-button type="danger" size="small" v-if="row.Status !== '已审核'"
              @click="deleteOrder(row.PurchaseOrderID)">删除</el-button>
              <el-button size="small" type="warning"  v-if="row.Status !== '已审核'" @click="">审批单</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>

</template>

<script setup>
import { ref } from "vue";
import { searchPurchaseRecords } from "@/apis/searchPurchaseRecords"
import { showMessage } from "@/utils/Ealert";
const searchForm = ref({
  productName: "",
  supplierName: "",
  employeeName: "",
  createdAt: [],
  status: ""
});
const handleSearch = async () => {
  try {
    const params = {
      ProductName: searchForm.value.productName,
      SupplierName: searchForm.value.supplierName,
      CreateTime: searchForm.value.createdAt,
      Status: searchForm.value.status,
      EmployeeName: searchForm.value.employeeName,
    };
    const response = await searchPurchaseRecords(params);
    showMessage("success","查询成功！" );
    purchaseOrders.value = response.data;
  } catch (error) {
    showMessage("error", error);
  }
}

const purchaseOrders = ref([]);

//
const getStatusTagType = (status) => {
  return status === "已审核" ? "success" : status === "待审核" ? "warning" : "info";
};

// 查看详情
const viewDetails = (row) => {
  const detailsContent = row.Details.map(detail => {
    return `
      <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #eee;">
        <p style="font-size: 16px; color: #333; font-weight: bold;">产品名称: <span style="color: #1f77d7;">${detail.ProductName}</span></p>
        <p style="font-size: 14px; color: #666;">数量: <span style="color: #f39c12;">${detail.Quantity}</span> 件</p>
        <p style="font-size: 14px; color: #666;">小计: <span style="color: #e74c3c;">¥${detail.SubTotal.toFixed(2)}</span></p>
      </div>
    `;
  }).join('');

  ElMessageBox.alert(`
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fff; border-radius: 8px;">
      <h3 style="text-align: center; font-size: 18px; color: #333;">采购单 ${row.PurchaseOrderID} 详情</h3>
      ${detailsContent}
    </div>
  `, "查看详情", {
    type: "info",
    dangerouslyUseHTMLString: true
  });
};



const deleteOrder = (id) => {
  ElMessageBox.confirm("确定删除该采购订单吗？", "删除确认", {
    type: "warning"
  }).then(() => {
    purchaseOrders.value = purchaseOrders.value.filter(order => order.PurchaseOrderID !== id);
    ElMessage.success("删除成功！");
  });
};

</script>

<style scoped>
.container {
  padding: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .search-card {
    overflow: visible;
    margin-bottom: 20px;
    padding: 10px;
  }

  .table-card {
    margin-bottom: 20px;
    padding: 10px;
    flex-grow: 1;
    overflow: auto;
    min-height: 0;
    /* position: fixed; */
  }
}

.btn-group {
  display: flex;
  align-items: center;
}
</style>
