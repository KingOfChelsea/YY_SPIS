<template>
  <el-container class="transfer-container">
    <el-header class="transfer-header">
      <h2>🏭仓库调拨申请</h2>
    </el-header>

    <el-main>
      <el-card shadow="hover" class="form-card">
        <el-form ref="transferForm" :model="transferData" :rules="rules" label-width="120px">
          <!-- 调出仓库 -->
          <el-form-item label="调出仓库" prop="FromWarehouseID">
            <el-select v-model="transferData.FromWarehouseID" placeholder="请选择调出仓库" @change="handleFromWarehouseChange">
              <el-option v-for="warehouse in warehouses" :key="warehouse.id" :label="`NO:${warehouse.id}-${warehouse.name}`" :value="warehouse.id" />
            </el-select>
          </el-form-item>

          <!-- 调入仓库 -->
          <el-form-item label="调入仓库" prop="ToWarehouseID">
            <el-select v-model="transferData.ToWarehouseID" placeholder="请选择调入仓库">
              <el-option
                v-for="warehouse in warehouses.filter(w => w.id !== transferData.FromWarehouseID)"
                :key="warehouse.id"
                :label="`NO:${warehouse.id}-${warehouse.name}`"
                :value="warehouse.id"
              />
            </el-select>
          </el-form-item>

          <!-- 选择产品 -->
          <el-form-item label="产品名称" prop="ProductID">
            <el-select v-model="transferData.ProductID" placeholder="请选择产品" :disabled="!filteredProducts.length">
              <el-option
                v-for="product in filteredProducts"
                :key="product.ProductName"
                :label="`${product.ProductName} (库存: ${product.TotalQuantity})`"
                :value="product.ProductName"
              />
            </el-select>
          </el-form-item>

          <!-- 调拨数量 -->
          <el-form-item label="调拨数量" prop="Quantity">
            <el-input-number v-model="transferData.Quantity" :min="1" :max="selectedProductStock" placeholder="输入调拨数量" />
          </el-form-item>

          <!-- 提交按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitTransfer" :loading="loading">提交申请</el-button>
            <el-button @click="clearFormData(transferData)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>


<script setup>

import { ref, reactive, computed, onMounted } from "vue";
import { queryDisbuteAPI } from "@/apis/warehouse/queryDisbute";
import { clearFormData } from "@/utils/tools";
clearFormData

// **仓库列表**
const warehouses = ref([]);

// **加载数据**
onMounted(async () => {
  const res = await queryDisbuteAPI({});
  console.log(res);

  warehouses.value = res.data.map(item => ({
    id: item.WarehouseID,
    name: item.WarehouseName,
    products: item.Products
  }));
});

// **表单数据**
const transferData = reactive({
  FromWarehouseID: null,
  ToWarehouseID: null,
  ProductID: null,
  Quantity: 1
});

// **计算被选中的仓库的产品**
const filteredProducts = computed(() => {
  const selectedWarehouse = warehouses.value.find(w => w.id === transferData.FromWarehouseID);
  return selectedWarehouse ? selectedWarehouse.products.filter(p => p.TotalQuantity > 0) : [];
});

// **获取选中产品的库存**
const selectedProductStock = computed(() => {
  const selectedProduct = filteredProducts.value.find(p => p.ProductName === transferData.ProductID);
  return selectedProduct ? selectedProduct.TotalQuantity : 1;
});

// **处理调出仓库变更**
const handleFromWarehouseChange = () => {
  transferData.ProductID = null;
  transferData.ToWarehouseID = null;
  transferData.Quantity = 1;
};

// **表单验证规则**
const rules = {
  FromWarehouseID: [{ required: true, message: "请选择调出仓库", trigger: "change" }],
  ToWarehouseID: [{ required: true, message: "请选择调入仓库", trigger: "change" }],
  ProductID: [{ required: true, message: "请选择产品", trigger: "change" }],
  Quantity: [{ required: true, message: "请输入调拨数量", trigger: "blur" }]
};

// **提交调拨申请**
const loading = ref(false);

const submitTransfer = () => {
  if (transferData.FromWarehouseID === transferData.ToWarehouseID) {
    ElMessage.error("调出仓库和调入仓库不能相同！");
    return;
  }

  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    ElMessage.success("调拨申请提交成功！");
    resetForm();
  }, 1500);
};

// **重置表单**

</script>

<style scoped>
/* 页面整体样式 */
.transfer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

/* 标题样式 */
.transfer-header {
  text-align: center;
  font-size: 24px;
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 表单卡片 */
.form-card {
  width: 600px;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

/* 按钮 */
.el-button {
  width: 100px;
}
</style>
