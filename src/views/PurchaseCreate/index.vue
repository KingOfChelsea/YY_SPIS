<template>
   <el-text class="mx-1" type="primary" size="large">采购订单</el-text>
  <el-form :model="formData" label-width="120px" class="purchase-form" ref="formRef" @submit.native.prevent="submitForm">
    <!-- 供应商ID 下拉框 -->
    <el-row :span="24">
      <el-col :span="5">
        <!-- 员工ID 输入框 -->
        <el-form-item label="员工ID" prop="EmployeeID" :rules="[{ required: true, message: '请输入员工ID', trigger: 'blur' }]">
          <el-input v-model="formData.EmployeeID" placeholder="请输入员工ID" size="large" />
        </el-form-item>
      </el-col>

      <el-col :span="10">
        <el-form-item label="供应商ID" prop="SupplierID" :rules="[{ required: true, message: '请选择供应商', trigger: 'change' }]">
          <el-select v-model="formData.SupplierID" placeholder="请选择供应商" size="large">
            <el-option v-for="supplier in suppliers" :key="supplier.SupplierID" :label="`${supplier.SupplierID} - ${supplier.SupplierName}`" :value="supplier.SupplierID" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="24" style="overflow: auto; height: 400px;">
        <!-- 动态表格 -->
        <el-form-item label="采购明细" :rules="[{ required: true, message: '请添加采购明细', trigger: 'blur' }]">
          <el-table :data="formData.Details" border style="width: 100%; margin-top: 20px;">
            <el-table-column label="产品ID" prop="ProductID">
              <template v-slot="scope">
                <el-select v-model="scope.row.ProductID" placeholder="请选择产品" size="small" class="input-width" @change="updateSubTotal(scope.row)">
                  <el-option v-for="product in products" :key="product.ProductID" :label="`${product.ProductID} - ${product.ProductName}`" :value="product.ProductID" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="Quantity">
              <template v-slot="scope">
                <el-input v-model="scope.row.Quantity" type="number" placeholder="请输入数量" size="small" class="input-width" :min="1" @blur="updateSubTotal(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="单价" prop="UnitPrice">
              <template v-slot="scope">
                <el-input v-model="scope.row.UnitPrice" type="number" placeholder="采购单价" size="small" class="input-width" :disabled="true" />
              </template>
            </el-table-column>
            <el-table-column label="小计" prop="SubTotal">
              <template v-slot="scope">
                <el-input v-model="scope.row.SubTotal" type="number" placeholder="小计" size="small" class="input-width" :disabled="true" />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template v-slot="scope">
                <el-button :icon="Delete" @click="removeDetail(scope.$index)" type="danger" size="small" class="delete-button">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 10px;">
            <!-- 添加新行 -->
            <el-button :icon="Edit" @click="addDetail" type="primary" size="large" class="add-button">
              添加明细
            </el-button>

            <el-button :icon="Upload" type="danger" @click="submitForm" size="large" class="submit-btn" :loading="loading">
              提交
            </el-button>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { Delete, Edit, Upload } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';
import { getSupplierData } from "@/apis/getSupplierData";
import { searchProductData } from "@/apis/searchProduct";
import { insertPurchaseordersAPI } from "@/apis/insertPurchaseorders";
import { showMessage } from "@/utils/Ealert";

// 供应商数据
const suppliers = ref([]);
const products = ref([]);
const formData = ref({
  SupplierID: '',
  EmployeeID: '',
  Details: [
    { ProductID: '', Quantity: 0, UnitPrice: 0, SubTotal: 0 }
  ]
});

const loading = ref(false);
const formRef = ref();

// 获取供应商和产品数据
onMounted(async () => {
  try {
    const SupplierData = await getSupplierData();
    suppliers.value = SupplierData.data;
    const ProductData = await searchProductData({
      "ProductID": "",
      "ProductName": "",
      "Category": "",
      "Unit": "",
      "UnitPrice": "",
      "StockQuantity": ""
    });
    products.value = ProductData.data;
  } catch (error) {
    showMessage("error", error);
  }
});

// 添加明细
const addDetail = () => {
  const lastDetail = formData.value.Details[formData.value.Details.length - 1];
  if (lastDetail.ProductID && lastDetail.Quantity > 0) {
    formData.value.Details.push({ ProductID: '', Quantity: 0, UnitPrice: 0, SubTotal: 0 });
  } else {
    showMessage("warning", "请填写有效的产品和数量");
  }
};

// 删除明细
const removeDetail = (index) => {
  formData.value.Details.splice(index, 1);
};

// 更新小计
const updateSubTotal = (row) => {
  const product = products.value.find(p => p.ProductID === row.ProductID);
  if (product && row.Quantity) {
    row.UnitPrice = product.UnitPrice;
    row.SubTotal = row.Quantity * row.UnitPrice;
  } else {
    row.SubTotal = 0;
  }
};

// 提交表单
const submitForm = async () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const invalidDetail = formData.value.Details.find(detail => !detail.ProductID || detail.Quantity <= 0);
      if (invalidDetail) {
        showMessage("error", "请确保每个明细的产品ID和数量有效");
      } else {
        loading.value = true;
        setTimeout(async () => {
          const res =  await insertPurchaseordersAPI(formData.value);
          loading.value = false;
          showMessage("success", "ID为"+res.PurchaseOrderID+"的"+res.message);
        }, 2000);
      }
    } else {
      showMessage("error", '请填写完整数据');
    }
  });
};
</script>

<style scoped>
/* .add-button {
  margin-top: 15px;
} */
</style>
