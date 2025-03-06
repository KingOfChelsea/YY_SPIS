<template>
  <el-container>
    <el-header>
      <h2>入库分配</h2>
    </el-header>

    <el-main>
      <!-- 入库分配表单 -->
      <el-form :model="form1" ref="form" label-width="120px">
        <el-form-item label="选择产品" :rules="[{ required: true, message: '请选择产品', trigger: 'blur' }]">
          <el-select v-model="form1.ProductID" placeholder="请选择产品"
            v-if="products_info && products_info.products.length > 0">
            <el-option v-for="item in products_info.products" :key="item.ProductID"
              :label="`${item.ProductName}  ——  可分配数量还剩：${item.RemainingStock - form1.Quantity}`"
              :value="item.ProductID" />
          </el-select>
        </el-form-item>

        <el-form-item label="选择仓库" :rules="[{ required: true, message: '请选择仓库', trigger: 'blur' }]">
          <el-select v-model="form1.WarehouseID" placeholder="请选择仓库"
            v-if="products_info && products_info.warehouses.length > 0">
            <el-option v-for="item in products_info.warehouses" :key="item.WarehouseID" :label="item.WarehouseName"
              :value="item.WarehouseID" />
          </el-select>
        </el-form-item>

        <el-form-item label="选择供应商" :rules="[{ required: true, message: '请选择供应商', trigger: 'blur' }]">
          <el-select v-model="form1.SupplierID" placeholder="请选择供应商"
            v-if="products_info && products_info.suppliers.length > 0">
            <el-option v-for="item in products_info.suppliers" :key="item.SupplierID" :label="item.SupplierName"
              :value="item.SupplierID" />
          </el-select>
        </el-form-item>

        <el-form-item label="入库数量" :rules="[{ required: true, message: '请输入入库数量', trigger: 'blur' }]">
          <el-input v-model="form1.Quantity" type="number" placeholder="请输入数量" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="clearFormData(form1)">重置</el-button>
        </el-form-item>
      </el-form>



    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { showMessage } from '@/utils/Ealert';
import { distributeProductsAPI } from '@/apis/warehouse/distributeProducts';
import { clearFormData } from '@/utils/tools';

defineProps({
  products_info: Object // 用 Object 类型来接受传入的 products_info
});

const form1 = ref({
  ProductID: '',
  WarehouseID: '',
  Quantity: '',
  SupplierID: ''
});


// 提交表单
async function submitForm() {
  // 表单验证
  if (!form1.value.ProductID || !form1.value.WarehouseID || !form1.value.SupplierID || !form1.value.Quantity) {
    showMessage("error", '请填写完整信息')
    return;
  }

  // 提交入库分配
  try {
    const res = await distributeProductsAPI(form1.value)
    if (res.success) {
      // 成功
      showMessage("success", res.message)

      // 重置表单
      clearFormData(form1.value)
      r
    } else {
      // 失败
      showMessage("warning", res.message)
    }
  } catch (error) {
    // 报错
    showMessage("error", error)
  }




}


</script>

<style scoped>
.el-dialog {
  border-radius: 6px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  margin-right: 10px;
}
</style>
