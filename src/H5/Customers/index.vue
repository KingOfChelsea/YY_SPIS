<template>
  <div class="order-container">
    <el-card class="order-card">
      <h1 class="order-title">订单详情</h1>
      <div v-if="order">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单ID">{{ order.OrderID }}</el-descriptions-item>
          <el-descriptions-item label="客户ID">{{ order.CustomerID }}</el-descriptions-item>
          <el-descriptions-item label="订单日期">{{ formatDate(order.OrderDate) }}</el-descriptions-item>
          <el-descriptions-item label="总金额">¥{{ order.TotalAmount.toFixed(2)  }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(order.Status)">{{ order.Status }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="客户名称">{{ order.CustomerName || '未提供' }}</el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <h2 class="order-subtitle">订单明细</h2>
        <el-table :data="order.OrderDetails" stripe>
          <el-table-column prop="ProductID" label="产品ID" />
          <el-table-column prop="Quantity" label="数量" />
          <el-table-column prop="Price" label="单价">
            <template #default="{ row }">
              ¥{{ row.Price.toFixed(2)  }}
            </template>
          </el-table-column>
          <el-table-column prop="SubTotal" label="小计">
            <template #default="{ row }">
              ¥{{ row.SubTotal.toFixed(2)  }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else class="no-order">
        <el-empty description="未找到订单信息" />
      </div>
      <div class="order-button">
        <el-button type="success" @click="btnSubmitOrder">确定报价</el-button>
        <el-button type="danger" @click="btnCancelOrder">取消报价</el-button>
      </div>

    </el-card>
  </div>
</template>

<script setup>
import { updateOrderStatusAPI } from '@/apis/sales/updateQuotationStatus';
import { showNotification } from '@/utils/Ealert';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const order = ref(null);
const route = useRoute();

onMounted(() => {
  const orderParam = route.query.order;
  if (orderParam) {
    try {
      const decodedOrder = decodeURIComponent(orderParam);
      order.value  = JSON.parse(decodedOrder);
    } catch (error) {
      showNotification("解析订单信息失败",error)
    }
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const getStatusTagType = (status) => {
  switch (status.toLowerCase())  {
    case 'pending':
      return 'warning';
    case 'completed':
      return 'success';
    default:
      return 'info';
  }
};

const btnSubmitOrder = async() =>{
  const userData = JSON.parse(localStorage.getItem("userData"))
  if (!userData.roleID == 1 ) {
    showNotification("warning","暂无权限！")
  }else{
    try {
      const res = await updateOrderStatusAPI( order.value.OrderID ,"Shipped")
      if (res.success) {
        showNotification("success",res.message)
      }else{
        showNotification("warning",res.message)
      }
    } catch (error) {
      showNotification("error",error)
    }
  }
}
const btnCancelOrder = async() =>{
  const userData = JSON.parse(localStorage.getItem("userData"))
  if (!userData.roleID == 1 ) {
    showNotification("warning","暂无权限！")
  }else{
    try {
      const res = await updateOrderStatusAPI( order.value.OrderID ,"Cancelled")
      if (res.success) {
        showNotification("success","订单取消成功")
      }else{
        showNotification("warning",res.message)
      }
    } catch (error) {
      showNotification("error",error)
    }
  }
}
</script>

<style scoped>
.order-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.order-card {
  padding: 20px;
}

.order-title {
  text-align: center;
  color: #409eff;
  font-size: 2rem;
  margin-bottom: 20px;
}

.order-subtitle {
  color: #67c23a;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.no-order {
  text-align: center;
}
.order-button{
  margin-top: 10px;
}
</style>
